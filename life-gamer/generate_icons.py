#!/usr/bin/env python3
"""
LifeGamer 图标生成器
生成契合"生活游戏化"主题的图标
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """创建 LifeGamer 图标"""
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 背景渐变 - 从深绿到浅绿
    for y in range(size):
        # 渐变色：从 #0A0A0F (深色) 到 #00D4AA (绿色)
        r = int(10 + (0 - 10) * y / size)
        g = int(10 + (212 - 10) * y / size)
        b = int(15 + (170 - 15) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # 圆角矩形背景
    margin = int(size * 0.05)
    radius = int(size * 0.15)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(10, 10, 15, 240)
    )

    # 绘制游戏手柄图标
    center_x, center_y = size // 2, size // 2
    scale = size / 1024

    # 手柄主体
    body_width = int(400 * scale)
    body_height = int(250 * scale)
    body_x = center_x - body_width // 2
    body_y = center_y - body_height // 2 + int(20 * scale)

    # 手柄形状（简化版）
    draw.rounded_rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        radius=int(50 * scale),
        fill=(0, 212, 170, 255)  # 主绿色
    )

    # 左侧十字键
    cross_size = int(30 * scale)
    cross_x = body_x + int(80 * scale)
    cross_y = center_y + int(20 * scale)
    draw.rectangle(
        [cross_x - cross_size, cross_y - cross_size // 3,
         cross_x + cross_size, cross_y + cross_size // 3],
        fill=(10, 10, 15, 255)
    )
    draw.rectangle(
        [cross_x - cross_size // 3, cross_y - cross_size,
         cross_x + cross_size // 3, cross_y + cross_size],
        fill=(10, 10, 15, 255)
    )

    # 右侧按钮
    btn_radius = int(20 * scale)
    btn_x = body_x + body_width - int(80 * scale)
    btn_y = center_y + int(20 * scale)
    draw.ellipse(
        [btn_x - btn_radius, btn_y - btn_radius - int(25 * scale),
         btn_x + btn_radius, btn_y + btn_radius - int(25 * scale)],
        fill=(255, 107, 107, 255)  # 红色按钮
    )
    draw.ellipse(
        [btn_x - btn_radius + int(30 * scale), btn_y - btn_radius + int(10 * scale),
         btn_x + btn_radius + int(30 * scale), btn_y + btn_radius + int(10 * scale)],
        fill=(255, 215, 0, 255)  # 黄色按钮
    )

    # 日记本图标（在手柄上方）
    book_width = int(120 * scale)
    book_height = int(150 * scale)
    book_x = center_x - book_width // 2
    book_y = body_y - int(120 * scale)

    # 日记本主体
    draw.rectangle(
        [book_x, book_y, book_x + book_width, book_y + book_height],
        fill=(255, 255, 255, 255)
    )

    # 日记本线条
    line_y_start = book_y + int(30 * scale)
    for i in range(4):
        line_y = line_y_start + int(i * 25 * scale)
        draw.line(
            [book_x + int(20 * scale), line_y,
             book_x + book_width - int(20 * scale), line_y],
            fill=(200, 200, 200, 255),
            width=int(3 * scale)
        )

    # 日记本封面装饰
    draw.rectangle(
        [book_x, book_y, book_x + int(15 * scale), book_y + book_height],
        fill=(0, 212, 170, 255)
    )

    # 经验值条（在手柄下方）
    exp_bar_width = int(300 * scale)
    exp_bar_height = int(25 * scale)
    exp_bar_x = center_x - exp_bar_width // 2
    exp_bar_y = body_y + body_height + int(40 * scale)

    # 经验值条背景
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_bar_width, exp_bar_y + exp_bar_height],
        radius=int(10 * scale),
        fill=(50, 50, 60, 255)
    )

    # 经验值条进度（70%）
    exp_progress = int(exp_bar_width * 0.7)
    draw.rounded_rectangle(
        [exp_bar_x, exp_bar_y, exp_bar_x + exp_progress, exp_bar_y + exp_bar_height],
        radius=int(10 * scale),
        fill=(0, 212, 170, 255)
    )

    # 等级标识（只在尺寸足够大时绘制）
    if size >= 256:
        level_text = "Lv.1"
        try:
            # 尝试使用系统字体
            font_size = max(12, int(36 * scale))
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            font = ImageFont.load_default()

        # 绘制等级文字
        text_x = exp_bar_x + int(10 * scale)
        text_y = exp_bar_y + int(3 * scale)
        draw.text((text_x, text_y), level_text, fill=(255, 255, 255, 255), font=font)

    # 保存图像
    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({size}x{size})")

def main():
    # 生成不同尺寸的图标
    icons = [
        (1024, 'assets/icon.png'),           # 主图标
        (1024, 'assets/adaptive-icon.png'),   # Android 自适应图标
        (48, 'assets/favicon.png'),           # 网页图标
        (1284, 'assets/splash.png'),          # 启动画面
    ]

    print("🎮 正在生成 LifeGamer 图标...")

    for size, filename in icons:
        if 'splash' in filename:
            # 启动画面使用不同样式
            create_splash(size, filename)
        else:
            create_icon(size, filename)

    print("\n✨ 所有图标生成完成！")

def create_splash(size, filename):
    """创建启动画面"""
    # 计算尺寸（宽屏）
    width = size
    height = int(size * 0.5)

    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 背景
    draw.rectangle([0, 0, width, height], fill=(10, 10, 15, 255))

    # 中心图标
    icon_size = int(min(width, height) * 0.3)
    icon_x = (width - icon_size) // 2
    icon_y = (height - icon_size) // 2 - int(height * 0.1)

    # 绘制简化的游戏手柄
    scale = icon_size / 1024
    center_x = icon_x + icon_size // 2
    center_y = icon_y + icon_size // 2

    # 手柄主体
    body_width = int(400 * scale)
    body_height = int(250 * scale)
    body_x = center_x - body_width // 2
    body_y = center_y - body_height // 2

    draw.rounded_rectangle(
        [body_x, body_y, body_x + body_width, body_y + body_height],
        radius=int(50 * scale),
        fill=(0, 212, 170, 255)
    )

    # 标题文字
    title = "LifeGamer"
    font_size = max(12, int(72 * scale))
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        font = ImageFont.load_default()

    # 计算文字位置
    text_bbox = draw.textbbox((0, 0), title, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = icon_y + icon_size + int(50 * scale)

    draw.text((text_x, text_y), title, fill=(255, 255, 255, 255), font=font)

    # 副标题
    subtitle = "生活游戏化"
    sub_font_size = max(10, int(36 * scale))
    try:
        sub_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", sub_font_size)
    except:
        sub_font = ImageFont.load_default()

    sub_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sub_width = sub_bbox[2] - sub_bbox[0]
    sub_x = (width - sub_width) // 2
    sub_y = text_y + int(80 * scale)

    draw.text((sub_x, sub_y), subtitle, fill=(0, 212, 170, 255), font=sub_font)

    img.save(filename, 'PNG')
    print(f"✅ 已生成: {filename} ({width}x{height})")

if __name__ == '__main__':
    main()
