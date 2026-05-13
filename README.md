# Gemini Code Assist RTL Support

Adds Right-to-Left (RTL) text direction support to the **Gemini Code Assist** chat interface in VS Code. Designed for Hebrew, Arabic, and Persian speakers who want natural text alignment when chatting with Gemini — without affecting code blocks or UI elements.

## ✨ Features

- **Toggle Button (⇄):** Easily switch RTL formatting on or off directly inside the Gemini Code Assist chat and Plan Preview.
- **Smart Detection:** Automatically detects Hebrew, Arabic, and Persian text in each chat bubble.
- **Code Block Preservation:** Strictly enforces LTR direction for all code blocks, keeping your code looking exactly as it should.
- **Status Bar Integration:** Quickly see if the RTL patch is currently applied to your Gemini installation, and toggle it with one click.

## 🚀 Getting Started

1. Install this extension.
2. Click **Gemini RTL: Off** in the VS Code status bar (or run the `Gemini RTL: Activate RTL` command).
3. **Reload VS Code** (`Developer: Reload Window`).
4. Open the Gemini Code Assist chat. You will now see a **⇄** toggle button.
5. Click the toggle to enable RTL. Text containing RTL scripts will automatically align to the right!

## 🔧 Commands

- `Gemini RTL: Activate RTL` - Injects the RTL CSS/JS payload into the Gemini Code Assist installation.
- `Gemini RTL: Deactivate RTL` - Removes the RTL logic and restores original Gemini files from backups.
- `Gemini RTL: Check Status` - Outputs diagnostics about the current installation state to the Output channel.

## 📝 License

[MIT License](LICENSE)
