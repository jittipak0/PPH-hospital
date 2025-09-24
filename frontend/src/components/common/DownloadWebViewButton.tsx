import React, { useState } from 'react'
import JSZip from 'jszip'
import { useI18n } from '../../lib/i18n'

interface DownloadWebViewButtonProps {
  className?: string
  filename?: string
}

const DEFAULT_ARCHIVE_NAME = 'hospital-webview-kit.zip'

const buildRootReadme = (origin: string) => `# Hospital WebView Kit

แพ็กเกจนี้สร้างขึ้นอัตโนมัติจากเว็บไซต์โรงพยาบาลประชารัฐ (${origin}) เพื่อช่วยให้คุณสร้างแอป
WebView สำหรับ Android และ iOS ได้อย่างรวดเร็ว โดยไฟล์ทั้งหมดจะอ้างอิงกลับมายังเว็บไซต์หลัก
ของโรงพยาบาลทันทีที่เปิดใช้งาน

## โครงสร้างไฟล์

- \`android/\` — ตัวอย่างโค้ด Kotlin + XML สำหรับฝังเว็บไซต์ลงใน WebView ของ Android
- \`ios/\` — ตัวอย่างโค้ด SwiftUI + WKWebView สำหรับ iOS
- \`README.md\` (ไฟล์นี้) — ภาพรวมและแนวทางการนำไปใช้

## วิธีใช้งาน

1. เปิดโฟลเดอร์แพลตฟอร์มที่คุณต้องการ (android หรือ ios)
2. ทำตามคำแนะนำในไฟล์ README ของแต่ละแพลตฟอร์มเพื่อนำโค้ดไปผสานกับโปรเจกต์ใหม่หรือโปรเจกต์ที่มีอยู่แล้ว
3. ทดสอบการใช้งานบนอุปกรณ์จริงหรือซิมูเลเตอร์ โดยตรวจสอบว่ามีการเชื่อมต่ออินเทอร์เน็ตเพื่อโหลดเนื้อหาจาก ${origin}

> หมายเหตุ: โค้ดตัวอย่างเปิดให้ปรับแต่งเพิ่มเติมตามความต้องการ เช่น เพิ่ม Splash Screen, ระบบนำทาง หรือการจัดการสถานะการเชื่อมต่ออินเทอร์เน็ต
`

const buildAndroidReadme = (origin: string) => `# Android WebView Shell

ไฟล์ในโฟลเดอร์นี้คือโปรเจกต์ตัวอย่างที่ใช้ \`ComponentActivity\` และ \`WebView\` ของ Android เพื่อโหลดเว็บไซต์โรงพยาบาลประชารัฐ (${origin}).

## วิธีสร้างโปรเจกต์ใหม่อย่างรวดเร็ว

1. เปิด Android Studio และสร้างโปรเจกต์ใหม่แบบ **Empty Views Activity** (หรือ Empty Activity)
2. หลังจากโปรเจกต์พร้อม ให้คัดลอกไฟล์ต่อไปนี้ไปวางทับภายใต้โฟลเดอร์เดียวกันในโปรเจกต์ของคุณ
   - \`app/src/main/java/com/hospital/webview/MainActivity.kt\`
   - \`app/src/main/res/layout/activity_main.xml\`
   - \`app/src/main/AndroidManifest.xml\`
3. ตรวจสอบให้แน่ใจว่าโมดูลของคุณใช้ \`compileSdk = 34\` (หรือใหม่กว่า) และเปิดใช้งาน Internet Permission ใน \`AndroidManifest.xml\`
4. สร้างแอปแล้วรันบนอุปกรณ์/เอมูเลเตอร์ที่มีอินเทอร์เน็ตเพื่อทดสอบ

### เคล็ดลับเพิ่มเติม

- สามารถเพิ่ม Splash Screen หรือ Offline Page ได้โดยแก้ไขที่ \`MainActivity.kt\`
- หากต้องการเปิดลิงก์ภายนอกในเบราว์เซอร์ ให้ปรับแต่งเมธอด \`shouldOverrideUrlLoading\`
`

const buildAndroidMainActivity = (origin: string) => `package com.hospital.webview

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
  private lateinit var webView: WebView

  @SuppressLint("SetJavaScriptEnabled")
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    webView = findViewById(R.id.hospitalWebView)

    with(webView.settings) {
      javaScriptEnabled = true
      domStorageEnabled = true
      loadWithOverviewMode = true
      useWideViewPort = true
      builtInZoomControls = false
      displayZoomControls = false
      cacheMode = WebSettings.LOAD_DEFAULT
    }

    webView.webViewClient = object : WebViewClient() {
      override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
        return false
      }

      @Suppress("OverridingDeprecatedMember")
      override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
        return false
      }
    }

    webView.loadUrl("${origin}")
  }

  override fun onBackPressed() {
    if (this::webView.isInitialized && webView.canGoBack()) {
      webView.goBack()
    } else {
      super.onBackPressed()
    }
  }

  override fun onDestroy() {
    if (this::webView.isInitialized) {
      webView.destroy()
    }
    super.onDestroy()
  }
}
`

const buildAndroidLayout = () => `<?xml version="1.0" encoding="utf-8"?>
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/hospitalWebView"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
`

const buildAndroidManifest = () => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hospital.webview">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Hospital WebView"
        android:supportsRtl="true">
        <activity
            android:name=".MainActivity"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`

const buildIosReadme = (origin: string) => `# iOS WebView Shell

ชุดไฟล์นี้ใช้ SwiftUI และ WKWebView เพื่อโหลดเว็บไซต์โรงพยาบาลประชารัฐ (${origin}).

## ขั้นตอนเริ่มต้นอย่างรวดเร็ว

1. เปิด Xcode และสร้างโปรเจกต์ใหม่แบบ **App** (SwiftUI)
2. คัดลอกไฟล์ Swift ต่อไปนี้ไปไว้ในโปรเจกต์ของคุณ
   - \`HospitalWebViewApp.swift\`
   - \`ContentView.swift\`
   - \`WebView.swift\`
3. เปิดไฟล์ \`Info.plist\` ของโปรเจกต์ และตรวจสอบว่ามีการตั้งค่า \`NSAppTransportSecurity -> NSAllowsArbitraryLoads = NO\` (ค่าเริ่มต้นของโปรเจกต์ใหม่จะรองรับ HTTPS อยู่แล้ว)
4. สร้างและรันทดสอบบน Simulator หรืออุปกรณ์จริงที่เชื่อมต่ออินเทอร์เน็ต

### ปรับแต่งเพิ่มเติม

- สามารถเพิ่มการจัดการสถานะโหลด (Loading indicator) ได้ใน \`WebView.swift\`
- หากต้องการรองรับการรีเฟรชแบบดึงลง ให้ใช้ \`SwiftUI Refreshable\` ร่วมกับ \`WKWebView.reload()\`
`

const buildIosAppFile = () => `import SwiftUI

@main
struct HospitalWebViewApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`

const buildIosContentView = (origin: string) => `import SwiftUI

private let hospitalURL = URL(string: "${origin}")!

struct ContentView: View {
    var body: some View {
        NavigationView {
            WebView(url: hospitalURL)
                .navigationTitle("โรงพยาบาลประชารัฐ")
                .navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(.stack)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
`

const buildIosWebView = () => `import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic

        let request = URLRequest(url: url)
        webView.load(request)

        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        // ไม่จำเป็นต้องอัปเดตอะไรเป็นพิเศษในตัวอย่างนี้
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        // สามารถจัดการสถานะโหลดหรือข้อผิดพลาดได้ที่นี่
    }
}
`

export const DownloadWebViewButton: React.FC<DownloadWebViewButtonProps> = ({ className, filename }) => {
  const { t } = useI18n()
  const [isPreparing, setIsPreparing] = useState(false)

  const handleDownload = async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || isPreparing) {
      return
    }

    const { origin } = window.location
    setIsPreparing(true)

    try {
      const zip = new JSZip()

      zip.file('README.md', buildRootReadme(origin))

      const android = zip.folder('android')
      android?.file('README.md', buildAndroidReadme(origin))
      const androidMain = android?.folder('app')?.folder('src')?.folder('main')
      androidMain?.file('AndroidManifest.xml', buildAndroidManifest())
      androidMain
        ?.folder('java')
        ?.folder('com')
        ?.folder('hospital')
        ?.folder('webview')
        ?.file('MainActivity.kt', buildAndroidMainActivity(origin))
      androidMain?.folder('res')?.folder('layout')?.file('activity_main.xml', buildAndroidLayout())

      const ios = zip.folder('ios')
      ios?.file('README.md', buildIosReadme(origin))
      ios?.file('HospitalWebViewApp.swift', buildIosAppFile())
      ios?.file('ContentView.swift', buildIosContentView(origin))
      ios?.file('WebView.swift', buildIosWebView())

      const blob = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = filename ?? DEFAULT_ARCHIVE_NAME
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(downloadUrl)
    } finally {
      setIsPreparing(false)
    }
  }

  const buttonLabel = isPreparing ? t('download.webview.preparing') : t('actions.downloadWebView')
  const ariaLabel = t('download.webview.ariaLabel')

  return (
    <>
      <button
        type="button"
        className={[className, 'download-webview-button'].filter(Boolean).join(' ')}
        onClick={() => {
          void handleDownload()
        }}
        aria-label={ariaLabel}
        disabled={isPreparing}
        aria-busy={isPreparing}
      >
        <span className="download-webview-button__icon" aria-hidden="true">
          {isPreparing ? '⏳' : '⬇️'}
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
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
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
        .download-webview-button[disabled] {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .download-webview-button__icon {
          font-size: 1.1rem;
          line-height: 1;
        }
      `}</style>
    </>
  )
}
