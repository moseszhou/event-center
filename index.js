/*
 * @Author: moses.zhou
 * @Date: 2019-02-20 09:03:31
 * @Last Modified by: moses.zhou
 * @Last Modified time: 2019-02-20 09:12:49
 *
 * const readyListener = eventManger.addEventListener("ready",(params)=>{ doing sth.});
 *
 *
 * readyListener.remove()
 *
 */

/**
 * @description: 事件管理器
 */
class EventManager {
  constructor() {
    this._events = [];
    this._eventId = 0;
  }

  /**
   *
   * @param {string} name
   * @param {()=>{}} fn
   * @returns {{remove:()=>{}}}
   */
  addEventListener(name, fn) {
    const id = this._eventId++;
    this._events.push({
      id,
      name,
      fn,
    });
    return {
      remove: () => {
        this.removeEventListener({ id });
      },
    };
  }

  /**
   *
   * @param {string} name
   * @param {()=>{}} fn
   */
  once(name, fn) {
    const id = this._eventId++;
    const remove = () => {
      this.removeEventListener({ id });
    };
    this._events.push({
      id,
      name,
      fn: (params) => {
        remove();
        fn(params);
      },
    });
  }

  /**
   *
   * @param {{id:number}} param0
   */
  removeEventListener({ id }) {
    const i = this._events.findIndex((x) => x.id === id);
    if (i > -1) {
      this._events.splice(i, 1);
    }
  }

  /**
   *
   * @param {string} name
   * @param {object} params
   */
  emit(name, params) {
    if (name) {
      // console.log(`emitter event:${name}`);
      const events = this._events.filter((x) => x.name === name);
      // console.assert(events.length == 0, `'${name}'事件还未有程序注册`);
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].fn(params) === true) {
          return;
        }
      }
    }
  }

  /**
   *
   * @param {string} name
   * @param {object} params
   * @returns {object}
   */
  waterfallEmit(name, params) {
    if (name) {
      // console.log(`emitter event:${name}`);
      const events = this._events.filter((x) => x.name === name);
      // console.assert(events.length == 0, `'${name}'事件还未有程序注册`);
      let data = params;
      let isEnd = false;
      for (let i = events.length - 1; i >= 0; i--) {
        data = events[i].fn(data, () => {
          isEnd = true;
        });
        if (isEnd) {
          break;
        }
      }
      return data;
    }
  }

  /**
   *
   * @param {string} name
   * @param {object} params
   */
  trigger(name, params) {
    this.emit(name, params);
  }
  /**
   *
   */
  clear() {
    this._events = [];
  }
}
export default new EventManager();
