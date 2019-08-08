
export class Manager {

  steps = new Map();

  constructor([ ...steps ], { ...props }) {
    if ((Object.keys(props)).length > 0) {
      let entries = Object.entries(props);

      for (let [ key, value ] of entries) {
        if (typeof value === 'string') {
          this[key] = value;
        }
      }
    }

    this.#setSteps(steps);
  }

  #setSteps(steps=[]) {
    for (let i in steps) {
      let entry = Object.entries(steps[i]);
      let k;
      let v;
      for (let [ key, value ] of entry) {
        if (this.steps.has(key)) {
          k = `${key}:${i}`;
          
        } else {
          k = key;
        }
        if (Array.isArray(value)) {
          v = value.map(item => {
            if (this.hasOwnProperty(item.toLowerCase())) {
              return `${this[`${item.toLowerCase()}`]}`;
            } else {
              return `${item}`;
            }
          });
        } else if (typeof value === 'string') {
          v = [ `${value}` ];
        }
        if (k && v) {
          this.steps.set(k, v);
        }
        
      }
    }
  }
}