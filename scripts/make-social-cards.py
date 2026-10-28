"""Render the site's social cards.

One template, one geometry (1200x630), one visual language: the sheet
background, Source Serif for the statement, IBM Plex Mono for the
coordinates, teal for the second clause, copper for the registration tick.
Cards differ only in words and in whether they carry a real capture.

    python3 scripts/make-social-cards.py
"""

from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
SHEET = (246, 241, 230)
SHEET_RAISED = (255, 253, 248)
INK = (21, 24, 28)
MUTED = (61, 67, 73)
FAINT = (83, 89, 95)
TEAL = (25, 78, 71)
COPPER = (146, 63, 33)
RULE = (205, 196, 173)
RULE_STRONG = (124, 116, 96)

FONTS = {
    "serif": "/tmp/fonts/serif-500.ttf",
    "inter": "/tmp/fonts/inter-400.ttf",
    "inter500": "/tmp/fonts/inter-500.ttf",
    "mono": "/tmp/fonts/mono.ttf",
}

GUTTER = 72
BOTTOM = H - 64


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONTS[name], size)


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=f) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def base() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), SHEET)
    draw = ImageDraw.Draw(img)

    # A single warm wash in the corner, matching the contact block.
    wash = Image.new("L", (W, H), 0)
    wdraw = ImageDraw.Draw(wash)
    wdraw.ellipse((-420, -520, 780, 520), fill=26)
    tint = Image.new("RGB", (W, H), (194, 99, 47))
    img = Image.composite(tint, img, wash.point(lambda v: v))
    img = Image.blend(Image.new("RGB", (W, H), SHEET), img, 0.10)
    draw = ImageDraw.Draw(img)
    return img, draw


def chrome(draw: ImageDraw.ImageDraw, eyebrow: str, right: str) -> None:
    mono = font("mono", 17)
    draw.rectangle([GUTTER, 56, GUTTER + 26, 58], fill=RULE_STRONG)
    draw.text((GUTTER + 40, 46), eyebrow, font=mono, fill=FAINT)
    if right:
        text = right
        draw.text((W - GUTTER - draw.textlength(text, font=mono), 46), text, font=mono, fill=FAINT)


def footer(draw: ImageDraw.ImageDraw, note: str) -> None:
    mono = font("mono", 16)
    draw.line([GUTTER, BOTTOM - 26, W - GUTTER, BOTTOM - 26], fill=RULE, width=1)
    draw.text((GUTTER, BOTTOM - 8), note, font=mono, fill=FAINT)
    domain = "stephen-mensah-portfolio.vercel.app"
    draw.text(
        (W - GUTTER - draw.textlength(domain, font=mono), BOTTOM - 8), domain, font=mono, fill=FAINT
    )


def statement(draw: ImageDraw.ImageDraw, lines: list[tuple[str, tuple[int, int, int]]], top: int,
              size: int, tracking: float = -1.4) -> int:
    f = font("serif", size)
    y = top
    for text, colour in lines:
        x = GUTTER
        for char in text:
            draw.text((x, y), char, font=f, fill=colour)
            x += draw.textlength(char, font=f) + tracking
        y += int(size * 1.06)
    return y


def sub(draw: ImageDraw.ImageDraw, text: str, top: int, width: int, size: int = 25) -> int:
    f = font("inter", size)
    y = top
    for line in wrap(draw, text, f, width):
        draw.text((GUTTER, y), line, font=f, fill=MUTED)
        y += int(size * 1.42)
    return y


def render(name: str, eyebrow: str, right: str, lines, note: str, caption: str = "",
           width: int = 700) -> None:
    img, draw = base()
    chrome(draw, eyebrow, right)
    y = statement(draw, lines, 128, 74)
    end = sub(draw, note, y + 26, width)
    if caption:
        rule_y = end + 34
        draw.line([GUTTER, rule_y, GUTTER + width, rule_y], fill=RULE, width=1)
        mono = font("mono", 16)
        draw.text((GUTTER, rule_y + 18), caption.upper(), font=mono, fill=COPPER)
    footer(draw, "STEPHEN MENSAH")
    os.makedirs("public/social", exist_ok=True)
    img.save(f"public/social/{name}.png", optimize=True)
    print("wrote", name, img.size)


def render_capture(name: str) -> None:
    """Syncareer's card carries the deployed product, not a drawing of it."""
    img, draw = base()
    chrome(draw, "SYNCAREER / CASE STUDY", "LIVE PRODUCT")

    f = font("serif", 76)
    for i, (text, colour) in enumerate(
        [("Career tools,", INK), ("with context.", TEAL)]
    ):
        draw.text((GUTTER, 120 + i * 82), text, font=f, fill=colour)

    sub(
        draw,
        "A saved opportunity, the tailored CV and the interview preparation in one record.",
        300,
        470,
        23,
    )

    shot = Image.open("public/images/syncareer/dashboard-1440.png").convert("RGB")
    target_w = 470
    shot.thumbnail((target_w, 460), Image.LANCZOS)
    frame_x, frame_y = W - GUTTER - shot.width, 150
    draw.rectangle(
        [frame_x - 12, frame_y - 12, frame_x + shot.width + 12, frame_y + shot.height + 12],
        fill=SHEET_RAISED,
        outline=RULE_STRONG,
    )
    img.paste(shot, (frame_x, frame_y))

    mono = font("mono", 14)
    draw.text((frame_x - 12, frame_y + shot.height + 22), "DEPLOYED PLATFORM / DASHBOARD", font=mono, fill=COPPER)

    footer(draw, "STEPHEN MENSAH")
    img.save(f"public/social/{name}.png", optimize=True)
    print("wrote", name, img.size)


def render_default() -> None:
    img, draw = base()
    chrome(draw, "SOFTWARE ENGINEER / GHANA", "STEPHEN MENSAH")
    statement(draw, [("Stephen Mensah", INK)], 150, 96, tracking=-2.2)
    mono = font("mono", 19)
    draw.text((GUTTER + 4, 286), "AI PRODUCTS, AND THE SYSTEMS BEHIND THEM", font=mono, fill=FAINT)
    sub(
        draw,
        "Syncareer, SessionBook and Koranco Farms — with the decisions, the source and the limits of each.",
        340,
        860,
        26,
    )
    draw.line([GUTTER, 470, W - GUTTER, 470], fill=RULE, width=1)
    f = font("inter500", 21)
    draw.text((GUTTER, 492), "Work · Lab · About · Contact", font=f, fill=TEAL)
    footer(draw, "STEPHEN MENSAH")
    os.makedirs("public/social", exist_ok=True)
    img.save("public/social-preview.png", optimize=True)
    print("wrote social-preview.png", img.size)


if __name__ == "__main__":
    render_default()

    render(
        "work",
        "THE WORKBENCH / THREE PROJECTS",
        "THREE CASE STUDIES",
        [("Built to be", INK), ("looked into.", TEAL)],
        "Three projects in three release states — the part I did, what is running, and what has not been verified.",
        caption="Syncareer · SessionBook · Koranco Farms",
    )

    render(
        "about",
        "THE WORKBENCH / ABOUT",
        "EXPERIENCE · WORK · STUDY",
        [("Thoughtful systems.", INK), ("Human reasons.", TEAL)],
        "Software engineer and Computer Science student at Ashesi University, Ghana. Experience, the projects behind each capability, and a selected academic record.",
        caption="Experience · Capabilities · Academic record",
    )

    render(
        "lab",
        "RELIABILITY LAB / ILLUSTRATIVE",
        "ONE REPLY, FIVE CHECKS",
        [("Fluent isn’t", INK), ("the same as true.", TEAL)],
        "One reply followed end to end: the context it carries, an answer that context cannot support, the gate that refuses it, and the person who decides.",
        caption="Fixtures and local checks — no model call",
    )

    render_capture("syncareer")

    render(
        "sessionbook",
        "SESSIONBOOK / CASE STUDY",
        "IMPLEMENTED · NO CALLS VERIFIED",
        [("A voice asks.", INK), ("The backend decides.", TEAL)],
        "An appointment-booking backend for a voice agent: availability, a row-locked booking transaction and a confirmation phrase designed to be read aloud.",
        caption="FastAPI · SQLAlchemy 2.0 · Postgres 16",
    )

    render(
        "koranco",
        "KORANCO FARMS / CASE STUDY",
        "MVP DELIVERED · NO PUBLIC BUILD",
        [("A farm’s records,", INK), ("connected.", TEAL)],
        "Attendance, produce and employee records for farm work, built offline-first through a six-week Ashesi Innovation Lab engagement.",
        caption="FastAPI · PostgreSQL · role-based access",
    )
