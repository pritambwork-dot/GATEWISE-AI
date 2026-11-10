package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val NorvaColorScheme = darkColorScheme(
    primary = NorvaLime,
    onPrimary = NorvaNight,
    primaryContainer = NorvaPillGrey,
    onPrimaryContainer = NorvaInk,
    secondary = NorvaCyan,
    onSecondary = NorvaNight,
    background = NorvaNight,
    onBackground = NorvaInk,
    surface = NorvaNight,
    onSurface = NorvaInk,
    surfaceVariant = NorvaPillGrey,
    onSurfaceVariant = NorvaInk
)

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = NorvaColorScheme,
        typography = Typography,
        content = content
    )
}
