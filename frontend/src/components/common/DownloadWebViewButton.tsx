import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import JSZip from 'jszip'
import { useI18n } from '../../lib/i18n'

type MobilePlatform = 'android' | 'ios'

interface DownloadWebViewButtonProps {
  className?: string
}

const PLACEHOLDER_ICON_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+gm4s/QAAAABJRU5ErkJggg=='

const PLACEHOLDER_SPLASH_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+gm4s/QAAAABJRU5ErkJggg=='

const gitignoreContents = [
  'node_modules',
  '.expo',
  '.expo-shared',
  'dist',
  'web-build',
  'android/app/build',
  'ios/build'
].join('\n')

const createPackageJson = (platform: MobilePlatform) =>
  JSON.stringify(
    {
      name: `hospital-webview-${platform}`,
      version: '1.0.0',
      private: true,
      scripts: {
        start: 'expo start --clear',
        android: 'expo run:android',
        ios: 'expo run:ios',
        web: 'expo start --web',
        'build:android': 'expo run:android --variant release',
        'build:ios': 'expo run:ios --configuration Release'
      },
      dependencies: {
        expo: '^51.0.17',
        'expo-status-bar': '~1.11.1',
        react: '18.2.0',
        'react-native': '0.74.3',
        'react-native-webview': '13.8.4'
      },
      devDependencies: {
        '@babel/core': '^7.24.9',
        'babel-preset-expo': '^11.0.6'
      }
    },
    null,
    2
  )

const createAppJson = (platform: MobilePlatform, origin: string) => {
  const slug = `hospital-webview-${platform}`
  const expoName = platform === 'android' ? 'Hospital WebView (Android)' : 'Hospital WebView (iOS)'
  const bundleId = 'th.co.pph.hospital.webview'

  const config = {
    expo: {
      name: expoName,
      slug,
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'automatic',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#0d6efd'
      },
      updates: {
        url: 'https://u.expo.dev/placeholder'
      },
      runtimeVersion: {
        policy: 'sdkVersion'
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: bundleId
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/icon.png',
          backgroundColor: '#0d6efd'
        },
        package: bundleId
      },
      web: {
        bundler: 'metro',
        favicon: './assets/icon.png'
      },
      extra: {
        contentOrigin: origin
      }
    }
  }

  return JSON.stringify(config, null, 2)
}

const appJsTemplate = (origin: string) => `import { StatusBar } from 'expo-status-bar'
import { Platform, SafeAreaView, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

export default function App() {
  const injectedJavaScript = "window.isEmbeddedWebView = true;"

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <WebView
        source={{ uri: '${origin}' }}
        allowsBackForwardNavigationGestures
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        originWhitelist={['*']}
        startInLoadingState
        mixedContentMode="always"
        injectedJavaScript={injectedJavaScript}
        style={styles.webview}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({ default: '#ffffff', ios: '#0d6efd10', android: '#0d6efd10' })
  },
  webview: {
    flex: 1
  }
})
`

const readmeTemplate = (platform: MobilePlatform, origin: string) => `# Hospital WebView (${platform === 'android' ? 'Android' : 'iOS'})

โปรเจกต์นี้ถูกสร้างขึ้นโดยอัตโนมัติจากเว็บไซต์โรงพยาบาลประชารัฐ เพื่อให้คุณ build แอป WebView แบบ native ได้อย่างรวดเร็ว โดยใช้ [Expo](https://expo.dev/).

This archive was generated automatically from the Pracharat Hospital website. It wraps **${origin}** inside a native WebView shell powered by [Expo](https://expo.dev/).

## 📦 โครงสร้างสำคัญ / Project structure

- \`App.js\` – หน้าหลักที่ฝัง WebView และตั้งค่า behavior พื้นฐาน
- \`app.json\` – การตั้งค่าของ Expo รวมถึงชื่อแอป ไอคอน และ URL ของเว็บไซต์
- \`assets/icon.png\`, \`assets/splash.png\` – รูปภาพ placeholder สามารถเปลี่ยนเป็นไฟล์แบรนด์จริงของคุณได้
- \`package.json\` – รายการ dependencies และ script ที่จำเป็น

## 🚀 ขั้นตอนเริ่มต้น (ไทย)

1. ติดตั้ง Node.js LTS และ Git บนเครื่องพัฒนา
2. รันคำสั่ง \`npm install\` เพื่อดาวน์โหลด dependencies
3. สำหรับการทดสอบระหว่างพัฒนา ให้รัน \`npm run ${platform}\`
4. สำหรับ build เวอร์ชันเผยแพร่
   - Android: \`npm run build:android\` แล้วเปิดโปรเจกต์ใน Android Studio เพื่อลงนามหรือสร้างไฟล์ AAB/APK
   - iOS: \`npm run build:ios\` แล้วเปิดโฟลเดอร์ \`ios\` ด้วย Xcode เพื่อตั้งค่า signing และสร้างไฟล์ IPA
5. แทนที่ไฟล์ไอคอนและสปลัชสกรีนในโฟลเดอร์ \`assets\` ก่อนส่งขึ้นสโตร์

## 🚀 Quick start (English)

1. Install the Node.js LTS runtime and Git on your workstation
2. Run \`npm install\` to install dependencies
3. Use \`npm run ${platform}\` for a development build on a connected device or simulator
4. Produce store-ready binaries
   - Android: \`npm run build:android\` then open the Android project in Android Studio to sign and export an APK/AAB
   - iOS: \`npm run build:ios\` and open the generated Xcode workspace to configure signing and create an IPA
5. Replace the placeholder icon and splash screen under \`assets/\` with your hospital branding

## ℹ️ หมายเหตุสำคัญ / Additional notes

- โปรเจกต์นี้ใช้ WebView ในการโหลด ${origin} ดังนั้นโปรดตรวจสอบให้แน่ใจว่าเว็บไซต์รองรับ HTTPS และอุปกรณ์พกพา
- คุณสามารถปรับแต่ง behavior เพิ่มเติมได้ในไฟล์ \`App.js\`
- หากต้องการ build ด้วยบริการคลาวด์ สามารถใช้ [EAS Build](https://docs.expo.dev/build/introduction/) ได้ทันที
`

const babelConfig = `module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo']
  }
}
`

const createExpoProjectZip = async (platform: MobilePlatform, origin: string) => {
  const zip = new JSZip()
  const root = `hospital-webview-${platform}`

  zip.file(`${root}/package.json`, createPackageJson(platform))
  zip.file(`${root}/app.json`, createAppJson(platform, origin))
  zip.file(`${root}/App.js`, appJsTemplate(origin))
  zip.file(`${root}/README.md`, readmeTemplate(platform, origin))
  zip.file(`${root}/babel.config.js`, babelConfig)
  zip.file(`${root}/.gitignore`, `${gitignoreContents}\n`)
  zip.file(`${root}/assets/icon.png`, PLACEHOLDER_ICON_BASE64, { base64: true })
  zip.file(`${root}/assets/splash.png`, PLACEHOLDER_SPLASH_BASE64, { base64: true })

  const blob = await zip.generateAsync({ type: 'blob' })
  const filename = `${root}.zip`

  return { blob, filename }
}

export const DownloadWebViewButton: React.FC<DownloadWebViewButtonProps> = ({ className }) => {
  const { t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState<MobilePlatform | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const ids = useMemo(() => {
    const unique = Math.random().toString(36).slice(2, 8)
    return {
      trigger: `download-webview-trigger-${unique}`,
      menu: `download-webview-menu-${unique}`,
      hint: `download-webview-hint-${unique}`
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }
    if (typeof document === 'undefined') {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current) {
        return
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }
    if (typeof document === 'undefined') {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsMenuOpen(false)
        const trigger = containerRef.current?.querySelector<HTMLButtonElement>('.download-webview-button')
        trigger?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!statusMessage && !errorMessage) {
      return
    }
    if (typeof window === 'undefined') {
      return
    }
    const timeout = window.setTimeout(() => {
      setStatusMessage(null)
      setErrorMessage(null)
    }, 6000)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [statusMessage, errorMessage])

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleDownload = useCallback(
    async (platform: MobilePlatform) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return
      }
      if (isDownloading) {
        return
      }
      try {
        setIsDownloading(platform)
        setStatusMessage(t('download.webview.preparing'))
        setErrorMessage(null)
        const origin = window.location.origin
        const { blob, filename } = await createExpoProjectZip(platform, origin)
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
        setStatusMessage(t('download.webview.ready'))
        setIsMenuOpen(false)
      } catch (error) {
        console.error('Failed to prepare mobile project download', error)
        setStatusMessage(null)
        setErrorMessage(t('download.webview.error'))
      } finally {
        setIsDownloading(null)
      }
    },
    [isDownloading, t]
  )

  const buttonLabel = t('actions.downloadWebView')
  const ariaLabel = t('download.webview.ariaLabel')

  return (
    <div className="download-webview" ref={containerRef}>
      <button
        type="button"
        id={ids.trigger}
        className={['download-webview-button', className].filter(Boolean).join(' ')}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-controls={ids.menu}
        onClick={handleToggleMenu}
        aria-label={ariaLabel}
      >
        <span className="download-webview-button__icon" aria-hidden="true">
          ⬇️
        </span>
        <span>{buttonLabel}</span>
      </button>
      {isMenuOpen ? (
        <div
          id={ids.menu}
          className="download-webview__menu"
          role="menu"
          aria-labelledby={ids.trigger}
          aria-describedby={ids.hint}
        >
          <p className="download-webview__menu-title">{t('download.webview.menuTitle')}</p>
          <p className="download-webview__menu-hint" id={ids.hint}>
            {t('download.webview.menuHint')}
          </p>
          <div className="download-webview__menu-options">
            <button
              type="button"
              role="menuitem"
              className="download-webview__menu-option"
              onClick={() => {
                void handleDownload('android')
              }}
              disabled={Boolean(isDownloading)}
            >
              <span className="download-webview__menu-option-label">{t('download.webview.androidLabel')}</span>
              <span className="download-webview__menu-option-desc">
                {t('download.webview.androidDescription')}
              </span>
              {isDownloading === 'android' && <span className="download-webview__menu-option-status">…</span>}
            </button>
            <button
              type="button"
              role="menuitem"
              className="download-webview__menu-option"
              onClick={() => {
                void handleDownload('ios')
              }}
              disabled={Boolean(isDownloading)}
            >
              <span className="download-webview__menu-option-label">{t('download.webview.iosLabel')}</span>
              <span className="download-webview__menu-option-desc">
                {t('download.webview.iosDescription')}
              </span>
              {isDownloading === 'ios' && <span className="download-webview__menu-option-status">…</span>}
            </button>
          </div>
        </div>
      ) : null}
      <div className="download-webview__status" aria-live="polite">
        {statusMessage ? <span>{statusMessage}</span> : null}
        {errorMessage ? <span className="download-webview__status-error">{errorMessage}</span> : null}
      </div>
      <style>{`
        .download-webview {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.4rem;
        }
        .download-webview-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border: 2px solid var(--color-primary);
          background-color: transparent;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .download-webview-button:hover,
        .download-webview-button:focus-visible {
          background-color: var(--color-primary);
          color: #fff;
        }
        .download-webview-button:focus-visible {
          outline: 3px solid var(--color-secondary);
          outline-offset: 3px;
        }
        .download-webview-button__icon {
          font-size: 1.1rem;
          line-height: 1;
        }
        .download-webview__menu {
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;
          min-width: 300px;
          border-radius: 16px;
          background-color: var(--color-surface, #ffffff);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
          padding: 1rem;
          z-index: 20;
        }
        .download-webview__menu-title {
          font-weight: 700;
          margin: 0;
        }
        .download-webview__menu-hint {
          margin: 0.35rem 0 0.75rem 0;
          font-size: 0.9rem;
          color: var(--color-muted-text, #4b5563);
        }
        .download-webview__menu-options {
          display: grid;
          gap: 0.75rem;
        }
        .download-webview__menu-option {
          width: 100%;
          text-align: left;
          background: rgba(13, 110, 253, 0.08);
          border: 1px solid rgba(13, 110, 253, 0.15);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: grid;
          gap: 0.35rem;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .download-webview__menu-option:hover,
        .download-webview__menu-option:focus-visible {
          background: rgba(13, 110, 253, 0.16);
          border-color: rgba(13, 110, 253, 0.3);
        }
        .download-webview__menu-option:disabled {
          opacity: 0.6;
          cursor: progress;
        }
        .download-webview__menu-option-label {
          font-weight: 600;
        }
        .download-webview__menu-option-desc {
          font-size: 0.9rem;
          color: var(--color-muted-text, #4b5563);
        }
        .download-webview__menu-option-status {
          font-size: 0.85rem;
          color: var(--color-primary);
        }
        .download-webview__status {
          min-height: 1.25rem;
          font-size: 0.85rem;
          color: var(--color-muted-text, #4b5563);
        }
        .download-webview__status-error {
          color: #dc2626;
        }
        @media (max-width: 600px) {
          .download-webview__menu {
            left: 0;
            right: auto;
            min-width: min(320px, 92vw);
          }
        }
      `}</style>
    </div>
  )
}
