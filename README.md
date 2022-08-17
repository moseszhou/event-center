# yum-event-manager

## Install

```bash
npm install yum-event-manager
```

## Usage

```js
import eventManger from 'yum-event-manager';

 const readyListener = eventManger.addEventListener("ready",(params)=>{ doing sth.});

 readyListener.remove()
```

the lasted listener can block the older listeners when it returns true.

## for example

```js

import eventManger from 'yum-event-manager';

 const listenerA = eventManger.addEventListener("ready",(params)=>{ doing sth.});
 const listenerB = eventManger.addEventListener("ready",(params)=>{
    doing sth;
 return true; });


eventManger.emit("ready",'only listenerB will be called')


```
