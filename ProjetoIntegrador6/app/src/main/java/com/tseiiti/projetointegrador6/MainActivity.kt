package com.tseiiti.projetointegrador6

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
//import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
//import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

//        val swipeToRefresh: SwipeRefreshLayout = findViewById(R.id.swipeToRefresh)
        val webView: WebView = findViewById(R.id.webView)

        webView.webViewClient = WebViewClient()
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true
//        webView.webViewClient = object : WebViewClient() {
//            override fun onPageFinished(view: WebView?, url: String?) {
//                swipeToRefresh.isRefreshing = false
//            }
//        }
//        webView.viewTreeObserver.addOnScrollChangedListener {
//            swipeToRefresh.isEnabled = (webView.scrollY == 0)
//        }

        val callback = object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        }
        onBackPressedDispatcher.addCallback(this, callback)

        webView.loadUrl("http://192.168.15.50/")

//        swipeToRefresh.setOnRefreshListener {
//            Toast.makeText(this, "Recarregamento da página", Toast.LENGTH_SHORT).show()
//            webView.reload()
//        }
    }
}