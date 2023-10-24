import type { Metadata } from 'next'

export function constructMetadata({
  title = 'ICAP - Lopatko V.',
  description = 'This is an test task for ICAP',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: 'Test task image desription',
        },
      ],
    },
    metadataBase: new URL('https://icap-lopatko.test.task.vercel.app'), // need change this after deploy
    themeColor: '#ffffff',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
