# 🎮 LifeGamer - 生活游戏化日记应用

> **记录生活，升级人生** —— 将日常生活变成一场有趣的游戏

LifeGamer 是一款基于 React Native + Expo 构建的生活游戏化日记应用。通过将日记记录与游戏元素相结合，让记录生活变得更加有趣和有动力。

## ✨ 核心功能

### 📝 日记系统
- **创建日记**：支持标题、内容、心情、标签
- **心情记录**：5种心情类型（😊开心、😌平静、😐一般、😢难过、😠生气）
- **日记管理**：查看、编辑、删除、收藏日记
- **数据导出**：支持将日记导出为 TXT 文件

### 🎯 游戏化系统
- **等级系统**：通过记录日记获得经验值，提升等级
- **连续打卡**：记录连续打卡天数，保持记录习惯
- **成就系统**：6个成就等你解锁
  - 📝 **初出茅庐**：写下第一篇日记
  - 🔥 **坚持不懈**：连续记录7天
  - 🎨 **情绪大师**：记录过所有5种心情
  - 📚 **百篇作者**：累计写下100篇日记
  - ⚔️ **探险启程**：等级达到10级
  - 🛡️ **勇者之路**：等级达到30级

### 📊 心情统计
- **心情日历**：可视化查看每日心情记录
- **月度统计**：统计本月心情分布
- **心情趋势**：了解自己的情绪变化

### 🎨 界面设计
- **暗色主题**：支持深色/浅色主题自动切换
- **现代UI**：简洁美观的卡片式设计
- **流畅动画**：平滑的过渡动画效果

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **React Native** | 跨平台移动应用框架 |
| **Expo** | React Native 开发工具链 |
| **Expo Router** | 基于文件的路由系统 |
| **Zustand** | 轻量级状态管理库 |
| **Expo SQLite** | 本地数据库存储 |
| **TypeScript** | 类型安全的 JavaScript |

## 📁 项目结构

```
life-gamer/
├── app/                    # 应用页面
│   ├── (tabs)/            # Tab 页面
│   │   ├── index.tsx      # 首页
│   │   ├── diary.tsx      # 日记列表
│   │   ├── mood.tsx       # 心情统计
│   │   └── profile.tsx    # 个人中心
│   ├── diary/
│   │   └── write.tsx      # 写日记页面
│   └── _layout.tsx        # 根布局
├── components/            # 组件
│   ├── ui/               # UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── DiaryCard.tsx      # 日记卡片
│   ├── MoodCalendar.tsx   # 心情日历
│   └── MoodSelector.tsx   # 心情选择器
├── constants/             # 常量
│   ├── colors.ts         # 颜色主题
│   ├── moods.ts          # 心情定义
│   └── achievements.ts   # 成就定义
├── database/              # 数据库
│   ├── init.ts           # 数据库初始化
│   ├── diaryQueries.ts   # 日记查询
│   ├── gameQueries.ts    # 游戏数据查询
│   └── webDb.ts          # Web 端数据库
├── stores/                # 状态管理
│   ├── diaryStore.ts     # 日记状态
│   └── gameStore.ts      # 游戏状态
├── types/                 # 类型定义
│   └── index.ts
└── utils/                 # 工具函数
    └── exportDiary.ts    # 日记导出
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn
- Expo CLI

### 安装依赖

```bash
# 进入项目目录
cd life-gamer

# 安装依赖
npm install
# 或
yarn install
```

### 运行项目

```bash
# 启动开发服务器
npm start
# 或
yarn start

# 运行 iOS 模拟器
npm run ios

# 运行 Android 模拟器
npm run android

# 运行 Web 版本
npm run web
```

## 📦 构建打包

### 方式一：EAS Build（推荐）

使用 Expo 官方的 EAS Build 云端构建服务：

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账号
eas login

# 3. 配置 EAS Build（首次需要）
eas build:configure

# 4. 构建 Android APK
eas build --platform android --profile preview

# 5. 构建 Android AAB（用于上架 Google Play）
eas build --platform android --profile production

# 6. 构建 iOS（需要 Apple 开发者账号）
eas build --platform ios
```

**EAS 配置文件 `eas.json` 示例：**

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 方式二：本地构建 APK

使用 Expo 本地构建（需要安装 Android Studio 和 JDK）：

```bash
# 1. 生成 Android 原生项目
npx expo prebuild --platform android

# 2. 进入 android 目录
cd android

# 3. 构建 Debug APK
./gradlew assembleDebug

# 4. 构建 Release APK
./gradlew assembleRelease

# 5. APK 文件位置
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

### 方式三：Expo Classic Build（已弃用）

```bash
# 构建 APK（需要 Expo 账号）
expo build:android -t apk

# 构建 AAB
expo build:android -t app-bundle
```

### 构建产物说明

| 格式 | 用途 | 命令 |
|------|------|------|
| `.apk` | 直接安装到手机 | `eas build --profile preview` |
| `.aab` | 上架 Google Play | `eas build --profile production` |
| `.ipa` | 上架 App Store | `eas build --platform ios` |

### 安装 APK 到手机

```bash
# 使用 ADB 安装（需要连接手机并开启 USB 调试）
adb install path/to/app.apk

# 或者直接将 APK 文件传输到手机安装
```

## 📱 应用截图

### 首页
- 显示当前等级和经验值
- 展示连续打卡天数
- 快速写日记入口
- 最近日记列表

### 日记页
- 日记列表展示
- 下拉刷新
- 浮动按钮快速新建

### 心情页
- 心情日历视图
- 月度心情统计
- 心情分布图表

### 个人中心
- 等级和经验值展示
- 统计数据（日记篇数、总字数）
- 成就系统
- 日记导出功能

## 🎮 游戏机制

### 经验值获取
- 每写一篇日记：+10 经验值
- 连续打卡奖励：额外经验值加成

### 等级系统
- 等级越高，升级所需经验值越多
- 每个等级对应不同的称号

### 成就解锁
- 自动检测并解锁成就
- 解锁后显示通知

## 📦 数据存储

应用使用 SQLite 本地数据库存储所有数据：
- **日记数据**：标题、内容、心情、标签、时间戳
- **游戏数据**：等级、经验值、成就、连续打卡天数
- **数据持久化**：应用重启后数据不丢失

## 🔧 配置说明

### 主题配置
在 `constants/colors.ts` 中可以自定义主题颜色：
- 浅色主题
- 深色主题
- 主色调、辅助色等

### 成就配置
在 `constants/achievements.ts` 中可以添加或修改成就：
- 成就 ID
- 成就标题
- 成就描述
- 成就图标

## 📄 许可证

本项目为私有项目，仅供个人使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**享受记录生活的乐趣，成为生活的游戏大师！** 🎮✨
