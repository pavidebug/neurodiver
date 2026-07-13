export const BUILD_INFO = {
  productName: 'NeuroDiver',
  version: '1.3.0',
  label: 'Pilot',
} as const

export function getBuildVersionLabel(): string {
  return `${BUILD_INFO.productName} v${BUILD_INFO.version} (${BUILD_INFO.label})`
}
