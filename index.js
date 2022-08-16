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
  static instance;

  constructor() {
    this._events = [];
    this._eventId = 0;
  }

  /**
   * @description: 事件管理器
   * @returns {EventManager}
   */
  static getInstance() {
    if (this.instance instanceof this === false) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   *
   * @param {string} name
   * @param {()=>{}} fn
   * @returns {{id:number,remove:()=>{}}}
   */
  addEventListener(name, fn) {
    this._events.push({
      id: this._eventId,
      name,
      fn,
    });
    this._eventId++;
    return {
      id: this._eventId,
      remove: () => {
        this.removeEventListener({ id: this._eventId });
      },
    };
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
      console.log(`emitter event:${name}`);
      const events = this._events.filter((x) => x.name === name);
      events.forEach((x) => x.fn(params));
      // console.assert(events.length == 0, `'${name}'事件还未有程序注册`);
    }
  }

  /**
   *
   * @param {string} name
   * @param {object} params
   */
  trigger(name, params) {
    this.emitter(name, params);
  }

  clear() {
    this._events = [];
  }
}
export default EventManager.getInstance();
