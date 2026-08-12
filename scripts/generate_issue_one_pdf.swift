#!/usr/bin/env swift

import Foundation
import AppKit

struct Article: Decodable {
    let slug: String
    let title: String
    let subtitle: String?
    let excerpt: String
    let category: String
    let author: String
    let artist: String
    let readingTime: Int
    let image: String
    let comingSoon: Bool?
}

struct TeamMember: Decodable {
    let name: String
    let role: String
    let image: String
}

struct Illustration {
    let after: String
    let path: String
    let caption: String
}

struct ArticleTheme {
    let background: NSColor
    let accent: NSColor
}

let fileManager = Foundation.FileManager.default
let root = URL(fileURLWithPath: fileManager.currentDirectoryPath)
let outputURL = root.appendingPathComponent("output/issue-one/grey-matters-penn-issue-one.pdf")
try fileManager.createDirectory(at: outputURL.deletingLastPathComponent(), withIntermediateDirectories: true)

let metadataData = try Data(contentsOf: root.appendingPathComponent("data/articles.json"))
let articles = try JSONDecoder().decode([Article].self, from: metadataData)
let teamData = try Data(contentsOf: root.appendingPathComponent("data/team.json"))
let team = try JSONDecoder().decode([TeamMember].self, from: teamData)
let bodySource = try String(contentsOf: root.appendingPathComponent("data/article-bodies.ts"), encoding: .utf8)

let illustrations: [String: [Illustration]] = [
    "truth-behind-intelligence": [
        Illustration(after: "Newton did it all in 18 months.", path: "/images/articles/inline/intelligence-newton.png", caption: "Isaac Newton, scientific discovery, and the architecture of intelligence."),
        Illustration(after: "Since birth, the brain undergoes the process of neurogenesis", path: "/images/articles/inline/intelligence-synapse.png", caption: "Neurons communicating across a synapse."),
        Illustration(after: "One such notable shift in intelligence was the introduction of the g factor", path: "/images/articles/inline/intelligence-framework.png", caption: "A framework for understanding intelligence."),
    ],
    "written-in-our-genes": [
        Illustration(after: "One of the most famous cases from this research was that of the “Jim twins,”", path: "/images/articles/inline/genes-jim-twins.png", caption: "The Jim twins and the study of inherited traits."),
        Illustration(after: "This question becomes further pervasive when certain genetic syndromes substantiate", path: "/images/articles/inline/genes-chromosome-dna.png", caption: "Chromosomes and the DNA double helix."),
        Illustration(after: "Another strong case for the influence of genes comes from studies on addiction.", path: "/images/articles/inline/genes-addiction.png", caption: "Genetic vulnerability and addiction."),
    ],
    "altered-mitochondrial-trafficking": [
        Illustration(after: "In healthy neurons, mitochondrial transport is needed to keep neurons alive", path: "/images/articles/inline/mitochondrial-ap-v2.png", caption: "Mitochondrial transport within a neuron."),
        Illustration(after: "Calcium-sensitive adaptor proteins like Miro", path: "/images/articles/inline/mitochondrial-synapse-v2.png", caption: "Signaling across the synapse."),
    ],
    "the-shrinking-brain": [
        Illustration(after: "Our brains are not fully developed until age 25", path: "/images/articles/inline/shrinking-brain-aging-tree.png", caption: "Brain development and change across the lifespan."),
        Illustration(after: "Regular exercise, maintaining a healthy diet", path: "/images/articles/inline/shrinking-brain-exercise.png", caption: "Exercise supports lifelong brain health."),
    ],
    "thinking-in-tongues": [
        Illustration(after: "The development of speaking fluency in two or more languages", path: "/images/articles/inline/thinking-in-tongues-cognitive-chart.png", caption: "Cognitive performance in monolingual and multilingual people."),
    ],
    "the-accelerating-clock": [
        Illustration(after: "Alongside the slowing of the biological pacemaker", path: "/images/articles/inline/accelerating-clock-attention-model.png", caption: "Arousal, attention, and attentional switching."),
    ],
]

let articleThemes: [String: ArticleTheme] = [
    "truth-behind-intelligence": ArticleTheme(background: NSColor(calibratedRed: 0.965, green: 0.945, blue: 0.91, alpha: 1), accent: NSColor(calibratedRed: 0.44, green: 0.20, blue: 0.52, alpha: 1)),
    "written-in-our-genes": ArticleTheme(background: NSColor(calibratedRed: 0.91, green: 0.95, blue: 0.90, alpha: 1), accent: NSColor(calibratedRed: 0.16, green: 0.45, blue: 0.30, alpha: 1)),
    "altered-mitochondrial-trafficking": ArticleTheme(background: NSColor(calibratedRed: 0.98, green: 0.92, blue: 0.86, alpha: 1), accent: NSColor(calibratedRed: 0.75, green: 0.25, blue: 0.13, alpha: 1)),
    "the-shrinking-brain": ArticleTheme(background: NSColor(calibratedRed: 0.89, green: 0.94, blue: 0.96, alpha: 1), accent: NSColor(calibratedRed: 0.12, green: 0.40, blue: 0.57, alpha: 1)),
    "thinking-in-tongues": ArticleTheme(background: NSColor(calibratedRed: 0.94, green: 0.91, blue: 0.97, alpha: 1), accent: NSColor(calibratedRed: 0.43, green: 0.22, blue: 0.62, alpha: 1)),
    "the-accelerating-clock": ArticleTheme(background: NSColor(calibratedRed: 0.98, green: 0.95, blue: 0.82, alpha: 1), accent: NSColor(calibratedRed: 0.68, green: 0.39, blue: 0.05, alpha: 1)),
    "feeling-our-age": ArticleTheme(background: NSColor(calibratedRed: 0.97, green: 0.90, blue: 0.91, alpha: 1), accent: NSColor(calibratedRed: 0.62, green: 0.18, blue: 0.28, alpha: 1)),
]

func body(for slug: String) -> String? {
    let marker = "\"\(slug)\": `"
    guard let markerRange = bodySource.range(of: marker) else { return nil }
    let contentStart = markerRange.upperBound
    guard let contentEnd = bodySource.range(of: "`,", range: contentStart..<bodySource.endIndex)?.lowerBound else { return nil }
    return String(bodySource[contentStart..<contentEnd])
}

func separateReferences(from body: String) -> (article: String, references: [String]) {
    let separators: [(marker: String, keepMarkerText: Bool)] = [
        ("\n\nBibliography\n\n", false),
        ("\nBibliography\n", false),
        ("\n\nReferences\n", false),
        ("\nReferences\n", false),
        ("\n\nZiegler P. The Black Death.", true),
    ]
    for separator in separators {
        if let range = body.range(of: separator.marker) {
            let referenceStart = separator.keepMarkerText ? range.lowerBound : range.upperBound
            let references = body[referenceStart...]
                .components(separatedBy: .newlines)
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty }
            return (String(body[..<range.lowerBound]), references)
        }
    }
    return (body, [])
}

let page = NSSize(width: 612, height: 792)
let margin: CGFloat = 54
let navy = NSColor(calibratedRed: 0.025, green: 0.09, blue: 0.15, alpha: 1)
let blue = NSColor(calibratedRed: 0.16, green: 0.68, blue: 0.95, alpha: 1)
let muted = NSColor(calibratedWhite: 0.72, alpha: 1)
let paper = NSColor(calibratedRed: 0.965, green: 0.955, blue: 0.925, alpha: 1)
let ink = NSColor(calibratedRed: 0.045, green: 0.10, blue: 0.14, alpha: 1)
var pageNumber = 0

func font(_ size: CGFloat, weight: NSFont.Weight = .regular) -> NSFont {
    NSFont.systemFont(ofSize: size, weight: weight)
}

func paragraphStyle(lineHeight: CGFloat, spacing: CGFloat = 0) -> NSMutableParagraphStyle {
    let style = NSMutableParagraphStyle()
    style.minimumLineHeight = lineHeight
    style.maximumLineHeight = lineHeight
    style.paragraphSpacing = spacing
    return style
}

guard let consumer = CGDataConsumer(url: outputURL as CFURL),
      var box = Optional(CGRect(origin: .zero, size: page)),
      let context = CGContext(consumer: consumer, mediaBox: &box, nil) else {
    fatalError("Unable to create PDF")
}

func beginPage(background: NSColor = navy) {
    context.beginPDFPage([:] as CFDictionary)
    pageNumber += 1
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
    background.setFill()
    NSBezierPath(rect: CGRect(origin: .zero, size: page)).fill()
}

func endPage() {
    NSGraphicsContext.restoreGraphicsState()
    context.endPDFPage()
}

func drawImage(_ path: String, in rect: NSRect) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    let scale = min(rect.width / image.size.width, rect.height / image.size.height)
    let size = NSSize(width: image.size.width * scale, height: image.size.height * scale)
    let target = NSRect(x: rect.midX - size.width / 2, y: rect.midY - size.height / 2, width: size.width, height: size.height)
    image.draw(in: target, from: NSRect.zero, operation: NSCompositingOperation.sourceOver, fraction: 1)
}

func drawImageCover(_ path: String, in rect: NSRect) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    let scale = max(rect.width / image.size.width, rect.height / image.size.height)
    let sourceWidth = rect.width / scale
    let sourceHeight = rect.height / scale
    let source = NSRect(x: (image.size.width - sourceWidth) / 2, y: (image.size.height - sourceHeight) / 2, width: sourceWidth, height: sourceHeight)
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(rect: rect).addClip()
    image.draw(in: rect, from: source, operation: NSCompositingOperation.sourceOver, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
}

func drawImageFrame(_ path: String, in rect: NSRect) {
    NSColor.white.setFill()
    NSBezierPath(rect: rect).fill()
    drawImage(path, in: rect.insetBy(dx: 10, dy: 10))
    NSColor(calibratedWhite: 0.78, alpha: 1).setStroke()
    let border = NSBezierPath(rect: rect)
    border.lineWidth = 0.6
    border.stroke()
}

func organicImagePath(in rect: NSRect, variant: Int) -> NSBezierPath {
    let path = NSBezierPath()
    let points: [NSPoint]
    switch variant % 3 {
    case 1:
        points = [
            NSPoint(x: rect.minX + rect.width * 0.08, y: rect.minY + rect.height * 0.05),
            NSPoint(x: rect.minX + rect.width * 0.92, y: rect.minY),
            NSPoint(x: rect.maxX, y: rect.minY + rect.height * 0.42),
            NSPoint(x: rect.minX + rect.width * 0.88, y: rect.maxY),
            NSPoint(x: rect.minX + rect.width * 0.12, y: rect.minY + rect.height * 0.94),
            NSPoint(x: rect.minX, y: rect.minY + rect.height * 0.46),
        ]
    case 2:
        points = [
            NSPoint(x: rect.minX, y: rect.minY + rect.height * 0.18),
            NSPoint(x: rect.minX + rect.width * 0.70, y: rect.minY),
            NSPoint(x: rect.maxX, y: rect.minY + rect.height * 0.28),
            NSPoint(x: rect.minX + rect.width * 0.94, y: rect.minY + rect.height * 0.90),
            NSPoint(x: rect.minX + rect.width * 0.35, y: rect.maxY),
            NSPoint(x: rect.minX + rect.width * 0.04, y: rect.minY + rect.height * 0.72),
        ]
    default:
        points = [
            NSPoint(x: rect.minX + rect.width * 0.12, y: rect.minY),
            NSPoint(x: rect.minX + rect.width * 0.86, y: rect.minY + rect.height * 0.04),
            NSPoint(x: rect.maxX, y: rect.minY + rect.height * 0.58),
            NSPoint(x: rect.minX + rect.width * 0.74, y: rect.maxY),
            NSPoint(x: rect.minX + rect.width * 0.08, y: rect.minY + rect.height * 0.88),
            NSPoint(x: rect.minX, y: rect.minY + rect.height * 0.32),
        ]
    }
    path.move(to: points[0])
    for index in points.indices {
        let current = points[index]
        let next = points[(index + 1) % points.count]
        let midpoint = NSPoint(x: (current.x + next.x) / 2, y: (current.y + next.y) / 2)
        path.curve(to: midpoint, controlPoint1: current, controlPoint2: current)
    }
    path.close()
    return path
}

func drawBlendedImage(_ path: String, in rect: NSRect, background: NSColor, variant: Int) {
    NSGraphicsContext.saveGraphicsState()
    organicImagePath(in: rect, variant: variant).addClip()
    drawImageCover(path, in: rect)
    NSGraphicsContext.restoreGraphicsState()
}

func drawAvatar(_ path: String, in rect: NSRect) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(ovalIn: rect).addClip()
    let scale = max(rect.width / image.size.width, rect.height / image.size.height)
    let size = NSSize(width: image.size.width * scale, height: image.size.height * scale)
    let target = NSRect(x: rect.midX - size.width / 2, y: rect.midY - size.height / 2, width: size.width, height: size.height)
    image.draw(in: target, from: NSRect.zero, operation: NSCompositingOperation.sourceOver, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
    blue.setStroke()
    let border = NSBezierPath(ovalIn: rect)
    border.lineWidth = 1.2
    border.stroke()
}

func themeFromArtwork(_ path: String) -> ArticleTheme {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url),
          let data = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: data) else {
        return ArticleTheme(background: paper, accent: blue)
    }

    let width = bitmap.pixelsWide
    let height = bitmap.pixelsHigh
    let borderX = max(1, width / 9)
    let borderY = max(1, height / 9)
    let step = max(1, min(width, height) / 80)
    var red: CGFloat = 0
    var green: CGFloat = 0
    var blueValue: CGFloat = 0
    var count: CGFloat = 0

    for y in stride(from: 0, to: height, by: step) {
        for x in stride(from: 0, to: width, by: step) where x < borderX || x >= width - borderX || y < borderY || y >= height - borderY {
            guard let color = bitmap.colorAt(x: x, y: y)?.usingColorSpace(.deviceRGB) else { continue }
            red += color.redComponent
            green += color.greenComponent
            blueValue += color.blueComponent
            count += 1
        }
    }

    guard count > 0 else { return ArticleTheme(background: paper, accent: blue) }
    red /= count
    green /= count
    blueValue /= count
    let background = NSColor(calibratedRed: 0.78 + red * 0.22, green: 0.78 + green * 0.22, blue: 0.78 + blueValue * 0.22, alpha: 1)
    let darkest = min(red, green, blueValue)
    let accentScale: CGFloat = darkest > 0.65 ? 0.55 : 0.72
    let accent = NSColor(calibratedRed: red * accentScale, green: green * accentScale, blue: blueValue * accentScale, alpha: 1)
    return ArticleTheme(background: background, accent: accent)
}

func draw(_ text: String, rect: NSRect, attributes: [NSAttributedString.Key: Any]) {
    NSString(string: text).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attributes)
}

func bodyText(_ text: String, attributes: [NSAttributedString.Key: Any], citationColor: NSColor = blue) -> NSMutableAttributedString {
    let result = NSMutableAttributedString(string: text, attributes: attributes)
    let patterns = [
        "([a-z\\)\\.,;:!?…”])(\\d{1,2}(?:\\s*,\\s*\\d{1,2})*)(?=[.\\s]|$)",
        "([\\.,;:!?…”])\\s+(\\d{1,2}(?:\\s*,\\s*\\d{1,2})*)$",
    ]
    for pattern in patterns {
        if let regex = try? NSRegularExpression(pattern: pattern) {
            let matches = regex.matches(in: text, range: NSRange(location: 0, length: result.length))
            for match in matches.reversed() {
                let citationRange = match.range(at: 2)
                result.addAttributes([
                    .font: font(7.2, weight: .semibold),
                    .foregroundColor: citationColor,
                    .baselineOffset: 4.2,
                ], range: citationRange)
            }
        }
    }
    return result
}

func drawAttributed(_ text: NSAttributedString, rect: NSRect) {
    text.draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading])
}

func drawPageNumber(color: NSColor = muted) {
    draw(String(format: "%02d", pageNumber), rect: NSRect(x: page.width - margin - 28, y: 25, width: 28, height: 16), attributes: [.font: font(8, weight: .semibold), .foregroundColor: color, .kern: 1.2])
}

// Cover
beginPage(background: .white)
drawImage("public/images/issues/issue-one-fall-2025-enhanced.png", in: NSRect(x: 0, y: 0, width: page.width, height: page.height))
endPage()

// Contents
beginPage()
draw("ISSUE ONE · FALL 2025", rect: NSRect(x: margin, y: 700, width: 500, height: 24), attributes: [.font: font(12, weight: .semibold), .foregroundColor: blue, .kern: 2.2])
draw("Inside the issue", rect: NSRect(x: margin, y: 640, width: 500, height: 52), attributes: [.font: font(38, weight: .light), .foregroundColor: NSColor.white])
var contentsY: CGFloat = 590
for (index, article) in articles.enumerated() {
    draw(String(format: "%02d", index + 1), rect: NSRect(x: margin, y: contentsY, width: 32, height: 24), attributes: [.font: font(11, weight: .bold), .foregroundColor: blue])
    draw(article.title, rect: NSRect(x: margin + 44, y: contentsY - 2, width: 430, height: 26), attributes: [.font: font(17, weight: .semibold), .foregroundColor: NSColor.white])
    if let subtitle = article.subtitle {
        draw(subtitle, rect: NSRect(x: margin + 44, y: contentsY - 23, width: 430, height: 20), attributes: [.font: font(10), .foregroundColor: muted])
    }
    draw("Written by \(article.author)  ·  Artwork by \(article.artist)", rect: NSRect(x: margin + 44, y: contentsY - 42, width: 430, height: 16), attributes: [.font: font(8.5, weight: .medium), .foregroundColor: blue])
    contentsY -= 68
}
drawPageNumber()
endPage()

// Contributors
beginPage(background: paper)
draw("THE PEOPLE BEHIND ISSUE ONE", rect: NSRect(x: margin, y: 714, width: 500, height: 20), attributes: [.font: font(9, weight: .bold), .foregroundColor: blue, .kern: 1.8])
draw("Meet the team", rect: NSRect(x: margin, y: 650, width: 500, height: 52), attributes: [.font: font(38, weight: .light), .foregroundColor: ink])
draw("This issue reflects the work of our entire team—across writing, editing, art, production, podcasts, social media, operations, and finance.", rect: NSRect(x: margin, y: 604, width: 500, height: 40), attributes: [.font: font(10.5), .foregroundColor: NSColor(calibratedWhite: 0.35, alpha: 1), .paragraphStyle: paragraphStyle(lineHeight: 15)])
let contributorColumnWidth: CGFloat = 166
for (index, member) in team.enumerated() {
    let column = index % 3
    let row = index / 3
    let x = margin + CGFloat(column) * contributorColumnWidth
    let y = 545 - CGFloat(row) * 91
    draw(member.name, rect: NSRect(x: x, y: y + 10, width: 150, height: 23), attributes: [.font: font(11, weight: .semibold), .foregroundColor: ink])
    draw(member.role, rect: NSRect(x: x, y: y - 18, width: 150, height: 28), attributes: [.font: font(8), .foregroundColor: NSColor(calibratedWhite: 0.38, alpha: 1), .paragraphStyle: paragraphStyle(lineHeight: 10)])
}
drawPageNumber(color: ink)
endPage()

var collectedReferences: [(article: Article, references: [String])] = []

for (index, article) in articles.enumerated() {
    let theme = themeFromArtwork(article.image)
    let articlePaper = theme.background
    let articleAccent = theme.accent
    let articleInk = ink

    // Article opener
    beginPage(background: articlePaper)
    drawImage(article.image, in: NSRect(x: 0, y: 448, width: page.width, height: 344))
    draw("ISSUE ONE  /  \(String(format: "%02d", index + 1))", rect: NSRect(x: margin, y: 380, width: 500, height: 20), attributes: [.font: font(9, weight: .bold), .foregroundColor: articleAccent, .kern: 1.6])
    draw(article.title, rect: NSRect(x: margin, y: 286, width: page.width - margin * 2, height: 88), attributes: [.font: font(32, weight: .light), .foregroundColor: ink, .paragraphStyle: paragraphStyle(lineHeight: 36)])
    if let subtitle = article.subtitle {
        draw(subtitle, rect: NSRect(x: margin, y: 228, width: page.width - margin * 2, height: 50), attributes: [.font: font(14), .foregroundColor: NSColor(calibratedWhite: 0.30, alpha: 1), .paragraphStyle: paragraphStyle(lineHeight: 19)])
    }
    draw("WRITTEN BY", rect: NSRect(x: margin, y: 168, width: 95, height: 16), attributes: [.font: font(8, weight: .bold), .foregroundColor: articleAccent, .kern: 1.5])
    draw(article.author, rect: NSRect(x: margin, y: 141, width: 245, height: 25), attributes: [.font: font(14, weight: .semibold), .foregroundColor: ink])
    draw("ARTWORK BY", rect: NSRect(x: 330, y: 168, width: 95, height: 16), attributes: [.font: font(8, weight: .bold), .foregroundColor: articleAccent, .kern: 1.5])
    draw(article.artist, rect: NSRect(x: 330, y: 141, width: 220, height: 25), attributes: [.font: font(14, weight: .semibold), .foregroundColor: ink])
    drawPageNumber(color: ink)
    endPage()

    guard let rawBody = body(for: article.slug), article.comingSoon != true else {
        beginPage(background: articlePaper)
        draw("ARTICLE FORTHCOMING", rect: NSRect(x: margin, y: 620, width: 500, height: 24), attributes: [.font: font(12, weight: .bold), .foregroundColor: articleAccent, .kern: 2])
        draw(article.excerpt, rect: NSRect(x: margin, y: 500, width: page.width - margin * 2, height: 100), attributes: [.font: font(23, weight: .light), .foregroundColor: ink, .paragraphStyle: paragraphStyle(lineHeight: 31)])
        draw("Written by \(article.author)  ·  Artwork by \(article.artist)", rect: NSRect(x: margin, y: 455, width: 500, height: 20), attributes: [.font: font(10, weight: .semibold), .foregroundColor: articleAccent])
        drawPageNumber(color: ink)
        endPage()
        continue
    }

    let separated = separateReferences(from: rawBody)
    if !separated.references.isEmpty {
        collectedReferences.append((article, separated.references))
    }
    let firstNewline = separated.article.firstIndex(of: "\n")
    let articleText = firstNewline.map { String(separated.article[separated.article.index(after: $0)...]) } ?? separated.article
    func looksLikeHeading(_ text: String) -> Bool {
        text.count < 80 && !text.contains(".") && !text.contains("doi:") && !text.contains("http")
    }

    var blocks: [String] = []
    var paragraphLines: [String] = []
    func flushParagraph() {
        if !paragraphLines.isEmpty {
            blocks.append(paragraphLines.joined(separator: " "))
            paragraphLines.removeAll()
        }
    }
    for sourceLine in articleText.components(separatedBy: .newlines) {
        let line = sourceLine.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        if line.isEmpty {
            flushParagraph()
        } else if looksLikeHeading(line) {
            flushParagraph()
            blocks.append(line)
        } else {
            paragraphLines.append(line)
        }
    }
    flushParagraph()
    let columnGap: CGFloat = 24
    let readingWidth = (page.width - margin * 2 - columnGap) / 2
    let columnX: [CGFloat] = [margin, margin + readingWidth + columnGap]
    var currentColumn = 0
    var currentY: CGFloat = 698

    func beginArticlePage() {
        beginPage(background: articlePaper)
        draw("GREY MATTERS  ·  ISSUE ONE", rect: NSRect(x: margin, y: 744, width: 220, height: 14), attributes: [.font: font(7.5, weight: .bold), .foregroundColor: articleAccent, .kern: 1.4])
        draw(article.title.uppercased(), rect: NSRect(x: 275, y: 744, width: page.width - margin - 275, height: 14), attributes: [.font: font(7.5, weight: .semibold), .foregroundColor: articleInk, .kern: 0.7])
        NSColor(calibratedRed: 0.75, green: 0.72, blue: 0.65, alpha: 1).setStroke()
        let rule = NSBezierPath()
        rule.move(to: NSPoint(x: margin, y: 731))
        rule.line(to: NSPoint(x: page.width - margin, y: 731))
        rule.lineWidth = 0.5
        rule.stroke()
        draw("WRITTEN BY \(article.author.uppercased())", rect: NSRect(x: margin, y: 43, width: 330, height: 14), attributes: [.font: font(7.5, weight: .semibold), .foregroundColor: NSColor(calibratedWhite: 0.32, alpha: 1), .kern: 0.5])
        drawPageNumber(color: articleInk)
        currentColumn = 0
        currentY = 698
    }

    func advanceColumn() {
        if currentColumn == 0 {
            currentColumn = 1
            currentY = 698
        } else {
            endPage()
            beginArticlePage()
        }
    }

    func measuredHeight(_ text: String, attributes: [NSAttributedString.Key: Any], width: CGFloat = readingWidth) -> CGFloat {
        ceil(bodyText(text, attributes: attributes, citationColor: articleAccent).boundingRect(with: NSSize(width: width, height: 4000), options: [.usesLineFragmentOrigin, .usesFontLeading]).height) + 10
    }

    func fittingWordCount(_ words: [Substring], attributes: [NSAttributedString.Key: Any], availableHeight: CGFloat, width: CGFloat = readingWidth) -> Int {
        var low = 1
        var high = words.count
        var best = 0
        while low <= high {
            let middle = (low + high) / 2
            let candidate = words.prefix(middle).joined(separator: " ")
            if measuredHeight(candidate, attributes: attributes, width: width) <= availableHeight {
                best = middle
                low = middle + 1
            } else {
                high = middle - 1
            }
        }
        return best
    }

    var renderedIllustrations = Set<String>()
    func renderIllustration(_ illustration: Illustration) {
        let imageURL = root.appendingPathComponent("public" + illustration.path)
        let aspect = NSImage(contentsOf: imageURL).map { $0.size.width / $0.size.height } ?? 1.6
        let imageHeight = min(210, readingWidth / max(aspect, 0.5))
        let figureHeight = imageHeight + 32
        if currentY - figureHeight < 70 {
            advanceColumn()
        }
        currentY -= 6
        drawBlendedImage(illustration.path, in: NSRect(x: columnX[currentColumn], y: currentY - imageHeight, width: readingWidth, height: imageHeight), background: articlePaper, variant: renderedIllustrations.count)
        currentY -= imageHeight + 6
        draw(illustration.caption, rect: NSRect(x: columnX[currentColumn], y: currentY - 18, width: readingWidth, height: 18), attributes: [.font: font(7.5), .foregroundColor: articleAccent, .paragraphStyle: paragraphStyle(lineHeight: 10)])
        currentY -= 26
        renderedIllustrations.insert(illustration.path)
    }

    beginArticlePage()
    for block in blocks {
        let isHeading = looksLikeHeading(block)
        let attrs: [NSAttributedString.Key: Any] = isHeading
            ? [.font: font(18, weight: .semibold), .foregroundColor: articleAccent, .paragraphStyle: paragraphStyle(lineHeight: 23, spacing: 10)]
            : [.font: font(11), .foregroundColor: articleInk, .paragraphStyle: paragraphStyle(lineHeight: 17.2, spacing: 8)]
        var remainingWords = block.split(whereSeparator: { $0.isWhitespace })

        let matchingIllustration = illustrations[article.slug]?.first(where: {
            !renderedIllustrations.contains($0.path) && block.localizedCaseInsensitiveContains(String($0.after.prefix(30)))
        })

        while !remainingWords.isEmpty {
            let availableHeight = currentY - 70
            let fullText = remainingWords.joined(separator: " ")
            let fullHeight = measuredHeight(fullText, attributes: attrs)

            if fullHeight <= availableHeight {
                drawAttributed(bodyText(fullText, attributes: attrs, citationColor: articleAccent), rect: NSRect(x: columnX[currentColumn], y: currentY - fullHeight, width: readingWidth, height: fullHeight))
                currentY -= fullHeight
                remainingWords.removeAll()
                continue
            }

            let wordCount = fittingWordCount(remainingWords, attributes: attrs, availableHeight: availableHeight)
            if wordCount > 0 && !isHeading {
                let pageText = remainingWords.prefix(wordCount).joined(separator: " ")
                let pageHeight = measuredHeight(pageText, attributes: attrs)
                drawAttributed(bodyText(pageText, attributes: attrs, citationColor: articleAccent), rect: NSRect(x: columnX[currentColumn], y: currentY - pageHeight, width: readingWidth, height: pageHeight))
                remainingWords.removeFirst(wordCount)
            }

            advanceColumn()
        }

        if let illustration = matchingIllustration, !isHeading {
            renderIllustration(illustration)
        }
    }
    for illustration in illustrations[article.slug] ?? [] where !renderedIllustrations.contains(illustration.path) {
        renderIllustration(illustration)
    }
    endPage()
}

// End-of-issue references
if !collectedReferences.isEmpty {
    beginPage()
    draw("ISSUE ONE · SOURCES", rect: NSRect(x: margin, y: 700, width: 500, height: 24), attributes: [.font: font(10, weight: .bold), .foregroundColor: blue, .kern: 2])
    draw("References", rect: NSRect(x: margin, y: 620, width: 500, height: 65), attributes: [.font: font(46, weight: .light), .foregroundColor: NSColor.white])
    draw("Complete source lists for every article are collected here for easier reading and verification.", rect: NSRect(x: margin, y: 558, width: 440, height: 50), attributes: [.font: font(15), .foregroundColor: muted, .paragraphStyle: paragraphStyle(lineHeight: 21)])
    drawPageNumber()
    endPage()

    var referenceY: CGFloat = 690
    func beginReferencePage() {
        beginPage(background: paper)
        draw("GREY MATTERS  ·  ISSUE ONE  ·  REFERENCES", rect: NSRect(x: margin, y: 744, width: 350, height: 14), attributes: [.font: font(7.5, weight: .bold), .foregroundColor: blue, .kern: 1.3])
        drawPageNumber(color: ink)
        referenceY = 700
    }

    beginReferencePage()
    for entry in collectedReferences {
        if referenceY < 140 {
            endPage()
            beginReferencePage()
        }
        draw(entry.article.title, rect: NSRect(x: margin, y: referenceY - 28, width: 500, height: 28), attributes: [.font: font(17, weight: .semibold), .foregroundColor: navy])
        referenceY -= 42

        for (index, reference) in entry.references.enumerated() {
            let label = "\(index + 1)."
            let attrs: [NSAttributedString.Key: Any] = [.font: font(8.8), .foregroundColor: ink, .paragraphStyle: paragraphStyle(lineHeight: 12.5, spacing: 5)]
            let referenceHeight = ceil(NSString(string: reference).boundingRect(with: NSSize(width: 452, height: 1000), options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attrs).height) + 9
            if referenceY - referenceHeight < 62 {
                endPage()
                beginReferencePage()
            }
            draw(label, rect: NSRect(x: margin, y: referenceY - 14, width: 24, height: 14), attributes: [.font: font(8, weight: .bold), .foregroundColor: blue])
            draw(reference, rect: NSRect(x: margin + 28, y: referenceY - referenceHeight, width: 452, height: referenceHeight), attributes: attrs)
            referenceY -= referenceHeight
        }
        referenceY -= 24
    }
    endPage()
}

context.closePDF()
print(outputURL.path)
