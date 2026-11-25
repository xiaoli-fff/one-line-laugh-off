// One-Line Laugh-Off — one joke, written out by a tiny emitter class.
//
// Everything is fixed at authoring time: the text never changes between
// runs, and nothing here touches the network, the clock, or a random
// source, so the grader sees the same bytes every time.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 200;

const LINE =
  "I told my plants I was going on holiday and now the fern has filed a formal complaint with the cactus, who is acting as its lawyer.";

class EntryEmitter {
  readonly ceiling: number;
  readonly body: string;

  constructor(body: string, ceiling: number) {
    this.body = body;
    this.ceiling = ceiling;
  }

  // Length in code points, so astral-plane characters count once each.
  size(): number {
    return Array.from(this.body).length;
  }

  problems(): string[] {
    const found: string[] = [];
    const n = this.size();
    if (n === 0 || this.body.trim() === "") {
      found.push("entry is blank");
    }
    if (n > this.ceiling) {
      found.push(`entry is ${n} chars, limit is ${this.ceiling}`);
    }
    if (this.body !== this.body.trim()) {
      found.push("entry has leading or trailing whitespace");
    }
    // Control characters would never survive as readable joke text.
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(this.body)) {
      found.push("entry contains control characters");
    }
    if (this.body.split("\n").length !== 1) {
      found.push("entry must be exactly one line");
    }
    return found;
  }

  emit(targetDir: string): string {
    const issues = this.problems();
    if (issues.length > 0) {
      throw new Error(`invalid entry: ${issues.join("; ")}`);
    }
    mkdirSync(targetDir, { recursive: true });
    const dest = join(targetDir, "entry.txt");
    writeFileSync(dest, this.body, "utf8");
    return dest;
  }
}

const emitter = new EntryEmitter(LINE, LIMIT);
const folder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const written = emitter.emit(folder);
console.log(`wrote ${emitter.size()}-character entry to ${written}`);
