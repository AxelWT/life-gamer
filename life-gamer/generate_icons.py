#!/usr/bin/env python3
"""
LifeGamer 图标生成器
生成带 LifeGamer 字样的游戏主题图标
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """创建 LifeGamer 图标"""
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 圆角矩形背景 - 深色渐变
    margin = int(size * 0.02)
    radius = int(size * 0.18)

    # 绘制背景
    for y in range(size):
        # 从深色到稍浅的渐变
        r = int(10 + (15 - 10) * y / size)
        g = int(10 + (15 - 10) * y / size)
        b = int(18 + (25 - 18) * y / size)
        draw.line([(margin, y), (size - margin, y)], fill=(r, g, b, 255))

    # 圆角遮罩
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=255
    )
    img.putalpha(mask)

    scale = size / 1024
    center_x = size // 2

    # ========== 上半部分：游戏手柄图标 ==========
    # 手柄主体
    body_width = int(320 * scale)
    body_height = int(180 * scale)
    body_x = center_x - body_width // 2
    body_y = int(180 * scale)

    # 手柄形状
    draw.rounded_rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        radius=int(45 * scale),
        fill=(0, 212, 170, 255)  # 主绿色
    )

    # 左侧十字键
    cross_size = int(22 * scale)
    cross_x = body_x + int(65 * scale)
    cross_y = body_y + body_height // 2
    draw.rectangle(
        [cross_x - cross_size, cross_y - cross_size // 3,
         cross_x + cross_size, cross_y + cross_size // 3],
        fill=(10, 10, 18, 255)
    )
    draw.rectangle(
        [cross_x - cross_size // 3, cross_y - cross_size,
         cross_x + cross_size // 3, cross_y + cross_size],
        fill=(10, 10, 18, 255)
    )

    # 右侧按钮
    btn_radius = int(16 * scale)
    btn_x = body_x + body_width - int(65 * scale)
    btn_y = body_y + body_height // 2

    # 按钮 A (红色)
    draw.ellipse(
        [btn_x - btn_radius, btn_y - btn_radius - int(20 * scale),
         btn_x + btn_radius, btn_y + btn_radius - int(20 * scale)],
        fill=(255, 107, 107, 255)
    )
    # 按钮 B (黄色)
    draw.ellipse(
        [btn_x - btn_radius + int(28 * scale), btn_y - btn_radius + int(8 * scale),
         btn_x + btn_radius + int(28 * scale), btn_y + btn_radius + int(8 * scale)],
        fill=(255, 215, 0, 255)
    )

    # ========== 中间：LifeGamer 文字 ==========
    # 主标题 LifeGamer
    title_font_size = int(140 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGamer"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (size - title_width) // 2
    title_y = int(420 * scale)

    # 文字阴影
    shadow_offset = int(3 * scale)
    draw.text(
        (title_x + shadow_offset, title_y + shadow_offset),
        title,
        fill=(0, 0, 0, 100),
        font=title_font
    )

    # 主文字
    draw.text((title_x, title_y), title, fill=(255, 255, 255, 255), font=title_font)

    # ========== 下方：装饰元素 ==========
    # 经验值条
    exp_bar_width = int(360 * scale)
    exp_bar_height = int(20 * scale)
    exp_bar_x = center_x - exp_bar_width // 2
    exp_bar_y = int(620 * scale)

    # 经验值条背景
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_bar_width, exp_bar_y + exp_bar_height],
        radius=int(10 * scale),
        fill=(40, 40, 50, 255)
    )

    # 经验值条进度 (70%)
    exp_progress = int(exp_bar_width * 0.7)
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_progress, exp_bar_y + exp_bar_height],
        radius=int(10 * scale),
        fill=(0, 212, 170, 255)
    )

    # Lv 文字
    lv_font_size = int(28 * scale)
    try:
        lv_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", lv_font_size)
    except:
        lv_font = ImageFont.load_default()

    lv_text = "Lv.1"
    lv_bbox = draw.textbbox((0, 0), lv_text, font=lv_font)
    lv_x = exp_bar_x + int(10 * scale)
    lv_y = exp_bar_y + int(1 * scale)
    draw.text((lv_x, lv_y), lv_text, fill=(255, 255, 255, 230), font=lv_font)

    # EXP 文字
    exp_text = "EXP"
    exp_text_bbox = draw.textbbox((0, 0), exp_text, font=lv_font)
    exp_text_x = exp_bar_x + exp_bar_width - int(50 * scale)
    draw.text((exp_text_x, lv_y), exp_text, fill=(255, 255, 255, 180), font=lv_font)

    # ========== 底部：副标题 ==========
    subtitle_font_size = int(48 * scale)
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_font_size)
    except:
        subtitle_font = ImageFont.load_default()

    subtitle = "记录生活 · 升级人生"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (size - subtitle_width) // 2
    subtitle_y = int(720 * scale)

    draw.text((subtitle_x, subtitle_y), subtitle, fill=(0, 212, 170, 200), font=subtitle_font)

    # ========== 装饰：像素点 ==========
    # 在角落添加像素装饰
    pixel_size = int(8 * scale)
    pixel_positions = [
        (int(60 * scale), int(60 * scale)),
        (int(80 * scale), int(40 * scale)),
        (int(40 * scale), int(80 * scale)),
        (size - int(60 * scale), int(60 * scale)),
        (size - int(80 * scale), int(40 * scale)),
        (size - int(40 * scale), int(80 * scale)),
    ]
    for px, py in pixel_positions:
        draw.rectangle(
            [px, py, px + pixel_size, py + pixel_size],
            fill=(0, 212, 170, 150)
        )

    # 保存图像
    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_adaptive_icon(size, filename):
    """创建 Android 自适应图标（带透明边缘）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 1024
    center_x = size // 2

    # 自适应图标的安全区域（中心 66%）
    safe_margin = int(size * 0.17)
    safe_size = size - 2 * safe_margin

    # 背景圆形
    bg_radius = int(safe_size * 0.48)
    draw.ellipse(
        [center_x - bg_radius, center_x - bg_radius,
         center_x + bg_radius, center_x + bg_radius],
        fill=(15, 15, 22, 255)
    )

    # 游戏手柄
    body_width = int(280 * scale)
    body_height = int(160 * scale)
    body_x = center_x - body_width // 2
    body_y = center_x - int(120 * scale)

    draw.rounded_rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        radius=int(40 * scale),
        fill=(0, 212, 170, 255)
    )

    # 十字键
    cross_size = int(20 * scale)
    cross_x = body_x + int(55 * scale)
    cross_y = body_y + body_height // 2
    draw.rectangle(
        [cross_x - cross_size, cross_y - cross_size // 3,
         cross_x + cross_size, cross_y + cross_size // 3],
        fill=(15, 15, 22, 255)
    )
    draw.rectangle(
        [cross_x - cross_size // 3, cross_y - cross_size,
         cross_x + cross_size // 3, cross_y + cross_size],
        fill=(15, 15, 22, 255)
    )

    # 按钮
    btn_radius = int(14 * scale)
    btn_x = body_x + body_width - int(55 * scale)
    btn_y = body_y + body_height // 2
    draw.ellipse(
        [btn_x - btn_radius, btn_y - btn_radius - int(18 * scale),
         btn_x + btn_radius, btn_y + btn_radius - int(18 * scale)],
        fill=(255, 107, 107, 255)
    )
    draw.ellipse(
        [btn_x - btn_radius + int(24 * scale), btn_y - btn_radius + int(6 * scale),
         btn_x + btn_radius + int(24 * scale), btn_y + btn_radius + int(6 * scale)],
        fill=(255, 215, 0, 255)
    )

    # LifeGamer 文字
    title_font_size = int(120 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGamer"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (size - title_width) // 2
    title_y = center_x + int(60 * scale)

    # 阴影
    draw.text(
        (title_x + int(2 * scale), title_y + int(2 * scale)),
        title,
        fill=(0, 0, 0, 80),
        font=title_font
    )
    draw.text((title_x, title_y), title, fill=(255, 255, 255, 255), font=title_font)

    # 经验值条
    exp_bar_width = int(300 * scale)
    exp_bar_height = int(16 * scale)
    exp_bar_x = center_x - exp_bar_width // 2
    exp_bar_y = center_x + int(220 * scale)

    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_bar_width, exp_bar_y + exp_bar_height],
        radius=int(8 * scale),
        fill=(40, 40, 50, 255)
    )
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + int(exp_bar_width * 0.7), exp_bar_y + exp_bar_height],
        radius=int(8 * scale),
        fill=(0, 212, 170, 255)
    )

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_favicon(size, filename):
    """创建网页图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 1024
    center = size // 2

    # 圆形背景
    radius = size // 2 - 1
    draw.ellipse([1, 1, size - 1, size - 1], fill=(0, 212, 170, 255))

    # 简化的手柄
    body_w = int(400 * scale)
    body_h = int(250 * scale)
    draw.rounded_rectangle(
        [center - body_w // 2, center - body_h // 2,
         center + body_w // 2, center + body_h // 2],
        radius=int(50 * scale),
        fill=(10, 10, 18, 255)
    )

    # 十字键
    cross = int(30 * scale)
    cx = center - int(80 * scale)
    draw.rectangle([cx - cross, center - cross // 3, cx + cross, center + cross // 3], fill=(0, 212, 170, 255))
    draw.rectangle([cx - cross // 3, center - cross, cx + cross // 3, center + cross], fill=(0, 212, 170, 255))

    # 按钮
    br = int(20 * scale)
    bx = center + int(80 * scale)
    draw.ellipse([bx - br, center - br - int(20 * scale), bx + br, center + br - int(20 * scale)], fill=(255, 107, 107, 255))
    draw.ellipse([bx - br + int(30 * scale), center - br + int(10 * scale), bx + br + int(30 * scale), center + br + int(10 * scale)], fill=(255, 215, 0, 255))

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def create_splash(size, filename):
    """创建启动画面"""
    width = size
    height = int(size * 0.5)

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 背景渐变
    for y in range(height):
        r = int(10 + (15 - 10) * y / height)
        g = int(10 + (15 - 10) * y / height)
        b = int(18 + (25 - 18) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    scale = width / 1284
    center_x = width // 2

    # 游戏手柄
    body_width = int(350 * scale)
    body_height = int(200 * scale)
    body_x = center_x - body_width // 2
    body_y = int(120 * scale)

    draw.rounded_rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        radius=int(45 * scale),
        fill=(0, 212, 170, 255)
    )

    # 十字键
    cross_size = int(25 * scale)
    cross_x = body_x + int(70 * scale)
    cross_y = body_y + body_height // 2
    draw.rectangle(
        [cross_x - cross_size, cross_y - cross_size // 3,
         cross_x + cross_size, cross_y + cross_size // 3],
        fill=(10, 10, 18, 255)
    )
    draw.rectangle(
        [cross_x - cross_size // 3, cross_y - cross_size,
         cross_x + cross_size // 3, cross_y + cross_size],
        fill=(10, 10, 18, 255)
    )

    # 按钮
    btn_radius = int(18 * scale)
    btn_x = body_x + body_width - int(70 * scale)
    btn_y = body_y + body_height // 2
    draw.ellipse(
        [btn_x - btn_radius, btn_y - btn_radius - int(22 * scale),
         btn_x + btn_radius, btn_y + btn_radius - int(22 * scale)],
        fill=(255, 107, 107, 255)
    )
    draw.ellipse(
        [btn_x - btn_radius + int(30 * scale), btn_y - btn_radius + int(10 * scale),
         btn_x + btn_radius + int(30 * scale), btn_y + btn_radius + int(10 * scale)],
        fill=(255, 215, 0, 255)
    )

    # LifeGamer 主标题
    title_font_size = int(90 * scale)
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica Bold.ttf", title_font_size)
    except:
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_font_size)
        except:
            title_font = ImageFont.load_default()

    title = "LifeGamer"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    title_y = int(400 * scale)

    # 阴影
    draw.text(
        (title_x + int(3 * scale), title_y + int(3 * scale)),
        title,
        fill=(0, 0, 0, 100),
        font=title_font
    )
    draw.text((title_x, title_y), title, fill=(255, 255, 255, 255), font=title_font)

    # 副标题
    subtitle_font_size = int(36 * scale)
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_font_size)
    except:
        subtitle_font = ImageFont.load_default()

    subtitle = "记录生活 · 升级人生"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    subtitle_y = int(530 * scale)

    draw.text((subtitle_x, subtitle_y), subtitle, fill=(0, 212, 170, 200), font=subtitle_font)

    # 经验值条
    exp_bar_width = int(400 * scale)
    exp_bar_height = int(22 * scale)
    exp_bar_x = center_x - exp_bar_width // 2
    exp_bar_y = int(620 * scale)

    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_bar_width, exp_bar_y + exp_bar_height],
        radius=int(11 * scale),
        fill=(40, 40, 50, 255)
    )
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + int(exp_bar_width * 0.65), exp_bar_y + exp_bar_height],
        radius=int(11 * scale),
        fill=(0, 212, 170, 255)
    )

    # Lv 文字
    lv_font_size = int(24 * scale)
    try:
        lv_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", lv_font_size)
    except:
        lv_font = ImageFont.load_default()

    draw.text(
        (exp_bar_x + int(8 * scale), exp_bar_y + int(2 * scale)),
        "Lv.1",
        fill=(255, 255, 255, 220),
        font=lv_font
    )

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({width}x{height})")

def main():
    """主函数"""
    print("🎮 LifeGamer 图标生成器")
    print("=" * 40)

    icons = [
        (1024, 'assets/icon.png', create_icon),
        (1024, 'assets/adaptive-icon.png', create_adaptive_icon),
        (48, 'assets/favicon.png', create_favicon),
        (1284, 'assets/splash.png', create_splash),
    ]

    for size, filename, func in icons:
        func(size, filename)

    print("=" * 40)
    print("✨ 所有图标生成完成！")
    print("\n📁 文件位置:")
    for _, filename, _ in icons:
        print(f"   • {filename}")

if __name__ == '__main__':
    main()
