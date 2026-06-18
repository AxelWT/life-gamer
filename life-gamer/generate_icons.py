#!/usr/bin/env python3
"""
LifeGame 图标生成器
深色背景 + 青蓝色 LifeGame 字样
"""

from PIL import Image, ImageDraw, ImageFont

# 主题颜色
BG_COLOR = (10, 10, 18, 255)  # 深色背景
TEXT_COLOR = (0, 212, 170, 255)  # 青蓝色主题色

def create_icon(size, filename):
    """创建主图标 - 深色背景 + LifeGame 字样"""
    img = Image.new('RGBA', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # 圆角背景
    margin = int(size * 0.02)
    radius = int(size * 0.18)

    # 创建圆角遮罩
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=255
    )

    # 应用遮罩
    img.putalpha(mask)

    scale = size / 1024
    center_x = size // 2

    # ========== LifeGame 主文字 ==========
    title_font_size = int(180 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGame"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = (size - title_width) // 2
    title_y = (size - title_height) // 2 - int(40 * scale)

    # 文字发光效果（多层绘制）
    for offset in range(3, 0, -1):
        alpha = int(30 / offset)
        glow_color = (0, 212, 170, alpha)
        draw.text(
            (title_x - offset, title_y - offset),
            title,
            fill=glow_color,
            font=title_font
        )
        draw.text(
            (title_x + offset, title_y + offset),
            title,
            fill=glow_color,
            font=title_font
        )

    # 主文字
    draw.text((title_x, title_y), title, fill=TEXT_COLOR, font=title_font)

    # ========== 副标题 ==========
    subtitle_font_size = int(52 * scale)
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_font_size)
    except:
        subtitle_font = ImageFont.load_default()

    subtitle = "记录生活 · 升级人生"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (size - subtitle_width) // 2
    subtitle_y = title_y + title_height + int(50 * scale)

    draw.text((subtitle_x, subtitle_y), subtitle, fill=(0, 212, 170, 180), font=subtitle_font)

    # ========== 装饰线条 ==========
    # 上方装饰线
    line_width = int(200 * scale)
    line_height = int(3 * scale)
    line_x = center_x - line_width // 2
    line_y = title_y - int(40 * scale)

    draw.rounded_rectangle(
        [line_x, line_y, line_x + line_width, line_y + line_height],
        radius=line_height // 2,
        fill=(0, 212, 170, 120)
    )

    # 下方装饰线
    line_y2 = subtitle_y + subtitle_font_size + int(30 * scale)
    draw.rounded_rectangle(
        [line_x, line_y2, line_x + line_width, line_y2 + line_height],
        radius=line_height // 2,
        fill=(0, 212, 170, 120)
    )

    # ========== 角落像素装饰 ==========
    pixel_size = int(8 * scale)
    pixel_positions = [
        (int(80 * scale), int(80 * scale)),
        (int(100 * scale), int(60 * scale)),
        (int(60 * scale), int(100 * scale)),
        (size - int(80 * scale) - pixel_size, int(80 * scale)),
        (size - int(100 * scale) - pixel_size, int(60 * scale)),
        (size - int(60 * scale) - pixel_size, int(100 * scale)),
        (int(80 * scale), size - int(80 * scale) - pixel_size),
        (int(60 * scale), size - int(100 * scale) - pixel_size),
        (size - int(80 * scale) - pixel_size, size - int(80 * scale) - pixel_size),
        (size - int(60 * scale) - pixel_size, size - int(100 * scale) - pixel_size),
    ]
    for px, py in pixel_positions:
        draw.rectangle(
            [px, py, px + pixel_size, py + pixel_size],
            fill=(0, 212, 170, 100)
        )

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_adaptive_icon(size, filename):
    """创建 Android 自适应图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 1024
    center_x = size // 2
    center_y = size // 2

    # 安全区域圆形背景
    safe_radius = int(size * 0.38)
    draw.ellipse(
        [center_x - safe_radius, center_y - safe_radius,
         center_x + safe_radius, center_y + safe_radius],
        fill=BG_COLOR
    )

    # LifeGame 文字
    title_font_size = int(160 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGame"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = (size - title_width) // 2
    title_y = center_y - title_height // 2 - int(30 * scale)

    # 发光效果
    for offset in range(2, 0, -1):
        alpha = int(25 / offset)
        glow_color = (0, 212, 170, alpha)
        draw.text(
            (title_x - offset, title_y - offset),
            title,
            fill=glow_color,
            font=title_font
        )

    draw.text((title_x, title_y), title, fill=TEXT_COLOR, font=title_font)

    # 副标题
    subtitle_font_size = int(44 * scale)
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_font_size)
    except:
        subtitle_font = ImageFont.load_default()

    subtitle = "记录生活 · 升级人生"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (size - subtitle_width) // 2
    subtitle_y = title_y + title_height + int(40 * scale)

    draw.text((subtitle_x, subtitle_y), subtitle, fill=(0, 212, 170, 160), font=subtitle_font)

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_favicon(size, filename):
    """创建网页图标"""
    img = Image.new('RGBA', (size, size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    scale = size / 1024

    # 圆形背景
    radius = size // 2 - 1
    draw.ellipse([0, 0, size - 1, size - 1], fill=BG_COLOR)

    # LG 缩写
    font_size = int(500 * scale)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text = "LG"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - int(50 * scale)

    draw.text((text_x, text_y), text, fill=TEXT_COLOR, font=font)

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_splash(size, filename):
    """创建启动画面"""
    width = size
    height = int(size * 0.5)

    img = Image.new('RGBA', (width, height), BG_COLOR)
    draw = ImageDraw.Draw(img)

    scale = width / 1284
    center_x = width // 2

    # LifeGame 主文字
    title_font_size = int(120 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGame"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    title_x = (width - title_width) // 2
    title_y = (height - title_height) // 2 - int(60 * scale)

    # 发光效果
    for offset in range(3, 0, -1):
        alpha = int(30 / offset)
        glow_color = (0, 212, 170, alpha)
        draw.text(
            (title_x - offset, title_y - offset),
            title,
            fill=glow_color,
            font=title_font
        )

    draw.text((title_x, title_y), title, fill=TEXT_COLOR, font=title_font)

    # 副标题
    subtitle_font_size = int(42 * scale)
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_font_size)
    except:
        subtitle_font = ImageFont.load_default()

    subtitle = "记录生活 · 升级人生"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    subtitle_y = title_y + title_height + int(50 * scale)

    draw.text((subtitle_x, subtitle_y), subtitle, fill=(0, 212, 170, 180), font=subtitle_font)

    # 装饰线
    line_width = int(300 * scale)
    line_height = int(3 * scale)
    line_x = center_x - line_width // 2

    draw.rounded_rectangle(
        [line_x, title_y - int(35 * scale), line_x + line_width, title_y - int(35 * scale) + line_height],
        radius=line_height // 2,
        fill=(0, 212, 170, 100)
    )

    draw.rounded_rectangle(
        [line_x, subtitle_y + subtitle_font_size + int(25 * scale),
         line_x + line_width, subtitle_y + subtitle_font_size + int(25 * scale) + line_height],
        radius=line_height // 2,
        fill=(0, 212, 170, 100)
    )

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({width}x{height})")

def main():
    """主函数"""
    print("🎮 LifeGame 图标生成器")
    print("=" * 50)
    print(f"背景颜色: 深色 RGB{BG_COLOR[:3]}")
    print(f"文字颜色: 青蓝色 RGB{TEXT_COLOR[:3]}")
    print("=" * 50)

    icons = [
        (1024, 'assets/icon.png', create_icon),
        (1024, 'assets/adaptive-icon.png', create_adaptive_icon),
        (48, 'assets/favicon.png', create_favicon),
        (1284, 'assets/splash.png', create_splash),
    ]

    for size, filename, func in icons:
        func(size, filename)

    print("=" * 50)
    print("✨ 所有图标生成完成！")
    print("\n📁 文件位置:")
    for _, filename, _ in icons:
        print(f"   • {filename}")

if __name__ == '__main__':
    main()
