---
title: Markdown 语法支持
publishDate: 2023-07-26 08:00:00
description: 'Markdown 是一种轻量级标记语言。'
tags:
  - Markdown
  - recommend
heroImage: { src: './thumbnail.jpg', color: '#B4C6DA' }
language: 'Chinese'
---

## 基础语法

Markdown 是一种轻量级且易于使用的语法，用于为你的写作添加样式。

### 标题

当文章内容较多时，可以使用标题进行分段：

```markdown
# 一级标题

## 二级标题

## 大标题

### 小标题
```

标题预览会破坏文章结构，因此此处不展示。

### 粗体和斜体

```markdown
_斜体文本_ 和 **粗体文本**，结合起来是 **_粗斜体文本_**
```

预览：

_斜体文本_ 和 **粗体文本**，结合起来是 **_粗斜体文本_**

### 链接

```markdown
文本链接 [链接名称](http://link-url)
```

预览：

文本链接 [链接名称](http://link-url)

### 行内代码

```markdown
这是一个 `行内代码`
```

预览：

这是一个 `行内代码`

### 代码块

````markdown
```js
// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return 1
  const result = fibonacci(n - 1) + fibonacci(n - 2) // [\!code --]
  return fibonacci(n - 1) + fibonacci(n - 2) // [\!code ++]
}
```
````

预览：

```js
// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return 1
  const result = fibonacci(n - 1) + fibonacci(n - 2) // [!code --]
  return fibonacci(n - 1) + fibonacci(n - 2) // [!code ++]
}
```

目前使用 shiki 作为代码高亮插件。支持的语言请参考 [Shiki: Languages](https://shiki.matsu.io/languages.html)。

### 行内公式

```markdown
这是一个行内公式 $e^{i\pi} + 1 = 0$
```

预览：

这是一个行内公式 $e^{i\pi} + 1 = 0$

### 公式块

```markdown
$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} \, dx
$$
```

预览：

$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} \, dx
$$

目前使用 KaTeX 作为数学公式插件。支持的语法请参考 [KaTeX Supported Functions](https://katex.org/docs/supported.html)。

#### 图片

```markdown
![CWorld](https://cravatar.cn/avatar/1ffe42aa45a6b1444a786b1f32dfa8aa?s=200)
```

预览：

![CWorld](https://cravatar.cn/avatar/1ffe42aa45a6b1444a786b1f32dfa8aa?s=200)

#### 删除线

```markdown
~~删除线~~
```

预览：

~~删除线~~

### 列表

常规无序列表

```markdown
- 1
- 2
- 3
```

预览：

- 1
- 2
- 3

常规有序列表

```markdown
1. GPT-4
2. Claude Opus
3. LLaMa
```

预览：

1. GPT-4
2. Claude Opus
3. LLaMa

你可以继续在列表中嵌套语法。

### 引用

```markdown
> 枪响，雷鸣，剑起。花与血的场面。
```

预览：

> 枪响，雷鸣，剑起。花与血的场面。

你可以继续在引用中嵌套语法。

### 换行

Markdown 需要一个空行来分隔段落。

```markdown
如果你不留空行
它将会在同一个段落

第一段

第二段
```

预览：

如果你不留空行
它将会在同一个段落

第一段

第二段

### 分隔线

如果你有写分隔线的习惯，可以另起一行并输入三个减号 `---` 或星号 `***`。在有段落时，前后各留一个空行：

```markdown
---
```

预览：

---

## 进阶技巧

### 行内 HTML 元素

目前仅支持部分行内 HTML 元素，包括 `<kdb> <b> <i> <em> <sup> <sub> <br>`，例如

#### 按键显示

```markdown
使用 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Del</kbd> 重启电脑
```

预览：

使用 <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Del</kbd> 重启电脑

#### 粗斜体

```markdown
<b> Markdown 也适用于此处，例如 _粗体_ </b>
```

预览：

<b> Markdown 也适用于此处，例如 _粗体_ </b>

### 其他 HTML 写法

#### 折叠块

```markdown
<details><summary>点击展开</summary>这是被隐藏的内容</details>
```

预览：

<details><summary>点击展开</summary>这是被隐藏的内容</details>

### 表格

```markdown
| 表头1  | 表头2  |
| -------- | -------- |
| 内容1 | 内容2 |
```

预览：

| 表头1  | 表头2  |
| -------- | -------- |
| 内容1 | 内容2 |

### 脚注

```markdown
使用 [^footnote] 在引用点添加脚注。

然后，在文档末尾添加脚注内容（默认渲染在文章末尾）。

[^footnote]: 这里是脚注的内容
```

预览：

使用 [^footnote] 在引用点添加脚注。

然后，在文档末尾添加脚注内容（默认渲染在文章末尾）。

[^footnote]: 这里是脚注的内容

### 待办清单

```markdown
- [ ] 未完成任务
- [x] 已完成任务
```

预览：

- [ ] 未完成任务
- [x] 已完成任务

### 符号转义

如果你需要在描述中使用 markdown 符号如 \_ # \* 但不希望它们被转义，你可以在这些符号前加反斜杠，如 `\_` `\#` `\*` 来避免。

```markdown
\_不希望这里的文本变为斜体\_

\*\*不希望这里的文本变为粗体\*\*
```

预览：

\_不希望这里的文本变为斜体\_

\*\*不希望这里的文本变为粗体\*\*

---

## 嵌入 Astro 组件

详情请见 [用户组件](/docs/integrations/components) 和 [高级组件](/docs/integrations/advanced)。
