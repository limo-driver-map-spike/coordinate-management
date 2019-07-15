// observer pattern  (Publisher/Subscriber pattern)
// 简单来说观察者设计模式包含两部分，一部分是发布者，另一部分是订阅者.
/**
 * 现在问题在于如何订阅，如何发布。 关系是一对多的关系，一个人发布，可以有多人订阅。
 */

/**
 * It is a crucial behavioural design pattern that defines
 * one-to-many dependencies between objects so that when one object (publisher) changes its state,
 * all the other dependent objects (subscribers) are notified and updated automatically.
 */

class Subject {
  constructor() {
    this._observers = [];
  }
  subscribe(observer) {
    this._observers.push(observer);
  }
  unsubscribe(observer) {
    this._observers = this.Observer.filter(obs => observer !== obs);
  }
  dispatch(change) {
    this._observers.forEach(observer => {
      observer.update(change);
    });
  }
}

class Observer {
  constructor(state) {
    this.state = state;
    this.initState = state;
  }
  update(change) {
    var state = this.state;
    switch (change) {
      case "INC":
        this.state = ++state;
        break;
      case "DEC":
        console.log("DEC");
        this.state = --state;
        break;
      default:
        this.state = this.initState;
    }
  }
}

// usage
const sub = new Subject();

// observer
const obs1 = new Observer(1);
const obs2 = new Observer(19);
const obs3 = new Observer(11);
const obs4 = new Observer(12);
const obs5 = new Observer(13);

sub.subscribe(obs1);
sub.subscribe(obs2);
sub.subscribe(obs3);
sub.subscribe(obs4);
sub.subscribe(obs5);

sub.dispatch("DEC");
console.log(obs1.state); // 2
console.log(obs2.state);
console.log(obs3.state);
console.log(obs4.state);
console.log(obs5.state);
