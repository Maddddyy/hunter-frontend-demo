const KEY = 'hunter-teach-complete';
export const TEACH_COMPLETE_EVENT = 'hunter-teach-complete';

export function isTeachComplete() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(KEY) === '1';
}

export function markTeachComplete() {
  window.localStorage.setItem(KEY, '1');
  window.dispatchEvent(new Event(TEACH_COMPLETE_EVENT));
}
