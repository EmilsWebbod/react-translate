
export default function keyEvent(key: string, onEvent: () => void) {
  const keydown = (e: KeyboardEvent) => {
    // @ts-ignore
    const targetName = e.target?.tagName?.toUpperCase();
    if (targetName === 'BODY' && e.key === key) {
      onEvent();
    }
  };
  document.addEventListener('keydown', keydown)
  return () => {
    document.removeEventListener('keydown', keydown);
  }
}