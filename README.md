# yum-event-center

## Install

```bash
npm install yum-event-center
```

## Usage

### 普通注册与调用

```js
import eventManger from "yum-event-center";

const readyListenerA = eventManger.addEventListener("ready", (params) => {
  console.log(`A:  ${params}`);
});
const readyListenerB = eventManger.addEventListener("ready", (params) => {
  console.log(`B:  ${params}`);
});
const readyListenerC = eventManger.once("ready", (params) => {
  console.log(`C:  ${params}`);
});
eventManger.emit("ready", "form emit");
eventManger.emit("ready", "form emit2");

readyListenerA.remove();
readyListenerB.remove();

// C: form emit
// B: form emit
// A: form emit
// B: form emit2
// A: form emit2
```

### 可拦截式注册与调用，返回 true 则拦截，不再继续执行（倒序触发）

```js
import eventManger from "yum-event-center";

const listenerA = eventManger.addEventListener("ready", (params) => {
  console.log(`A:  ${params}`);
});
const listenerB = eventManger.addEventListener("ready", (params) => {
  console.log(`B:  ${params}`);
  return true;
});

const listenerC = eventManger.addEventListener("ready", (params) => {
  console.log(`C:  ${params}`);
});

eventManger.emit("ready", "form waterfallEmit");

readyListenerA.remove();
readyListenerB.remove();
readyListenerC.remove();

// C: form waterfallEmit
// B: form waterfallEmit
```

## 瀑布流注册与调用, 返回值会传递给下一个监听器

```js
import eventManger from "yum-event-center";

const listenerA = eventManger.addEventListener("ready", (params) => {
  console.log(`A:  ${params}`);
});
const listenerB = eventManger.addEventListener("ready", (params, endFn) => {
  console.log(`B:  ${params}`);
  endFn(); // block the listenerA
});

const listenerC = eventManger.addEventListener("ready", (params, endFn) => {
  console.log(`C:  ${params}`);
  return "form listenerC";
});

eventManger.waterfallEmit("ready", "form waterfallEmit");

readyListenerA.remove();
readyListenerB.remove();
readyListenerC.remove();

// C: form waterfallEmit
// B: form listenerC
```
