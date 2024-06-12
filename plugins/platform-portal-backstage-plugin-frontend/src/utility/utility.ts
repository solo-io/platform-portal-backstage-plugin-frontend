// navigator.clipboard.writeText doesn't always work.
//
export async function copyToClipboard(textToCopy: string) {
  // Navigator clipboard api needs a secure context (https)
  if (window.navigator.clipboard && window.isSecureContext) {
    await window.navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}

export function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

export const customLog = (...args: Parameters<typeof console.log>) => {
  if (localStorage.getItem('gloo-platform-portal:logging-enabled') === 'true') {
    console.log(...args);
  }
};
