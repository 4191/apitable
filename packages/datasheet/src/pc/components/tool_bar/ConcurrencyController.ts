export class ConcurrencyController {
  maxConcurrency: number;
  currentConcurrency: number;
  taskQueue: Array<{ task: any; resolve: any }>; // 或者用泛型

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
    this.currentConcurrency = 0;
    this.taskQueue = [];
  }

  addTask(task: any) {
    return new Promise((resolve) => {
      this.taskQueue.push({ task, resolve });
      this.check();
    });
  }

  check() {
    if (this.currentConcurrency < this.maxConcurrency && this.taskQueue.length > 0) {
      const { task, resolve } = this.taskQueue.shift();
      const result = task();
      resolve(result);
      this.currentConcurrency++;
      result.then(() => {
        this.currentConcurrency--;
        this.check();
      });
    }
  }
}
