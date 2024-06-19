type ResponsiveLoaderAsset = {
    src: string
}

export function getImageAsset(filename: string): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const img = require(`@/renderer/client/assets/img/${filename}`) as ResponsiveLoaderAsset
    return img.src
}

export async function getImageAssetAsync(filename: string): Promise<string> {
    const img = await import(`@/renderer/client/assets/img/${filename}`) as ResponsiveLoaderAsset
    return img.src
}
