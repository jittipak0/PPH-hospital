import React from 'react'
import { useI18n } from '../../lib/i18n'

interface DownloadWebViewButtonProps {
  className?: string
  filename?: string
}

const WEBVIEW_FILENAME = 'hospital-webview.html'

const buildWebViewHtml = (origin: string) => `<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hospital WebView</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: #0d6efd10;
        font-family: 'Sarabun', 'Noto Sans Thai', system-ui, sans-serif;
        color: #1f2937;
      }
      .webview-shell {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
      }
      header {
        padding: 1rem 1.25rem;
        background: #ffffff;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.1);
      }
      header h1 {
        font-size: 1.2rem;
        margin: 0 0 0.25rem 0;
      }
      header p {
        margin: 0;
        font-size: 0.95rem;
        color: #4b5563;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background: #0b1120;
          color: #f8fafc;
        }
        header {
          background: #111827;
          color: #f8fafc;
          border-bottom-color: rgba(148, 163, 184, 0.24);
        }
        header p {
          color: #cbd5f5;
        }
      }
    </style>
  </head>
  <body>
    <div class="webview-shell">
      <header>
        <h1>โรงพยาบาลประชารัฐ</h1>
        <p>เวอร์ชันสำหรับฝังใน WebView — เนื้อหาหลักโหลดจาก ${origin}</p>
      </header>
      <iframe src="${origin}" title="Hospital WebView" allow="fullscreen"></iframe>
    </div>
  </body>
</html>`

export const DownloadWebViewButton: React.FC<DownloadWebViewButtonProps> = ({ className, filename }) => {
  const { t } = useI18n()

  const handleDownload = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    const { origin } = window.location
    const html = buildWebViewHtml(origin)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename ?? WEBVIEW_FILENAME
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const buttonLabel = t('actions.downloadWebView')
  const ariaLabel = t('download.webview.ariaLabel')

  return (
    <>
      <button
        type="button"
        className={[className, 'download-webview-button'].filter(Boolean).join(' ')}
        onClick={handleDownload}
        aria-label={ariaLabel}
      >
        <span className="download-webview-button__icon" aria-hidden="true">
          ⬇️
        </span>
        <span>{buttonLabel}</span>
      </button>
      <style>{`
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
      `}</style>
    </>
  )
}
