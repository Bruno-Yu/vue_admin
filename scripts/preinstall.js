if (!/yarn/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository must using yarn as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1) // 則直接結束，無法執行
}