interface Window {
  [key: string]: any
}

if ((window as Window).__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  (__webpack_public_path__ as any) = (window as Window).__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
