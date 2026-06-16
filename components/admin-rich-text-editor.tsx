"use client";

import type { ClipboardEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  PaintBucket,
  SmilePlus,
  Strikethrough,
  Table2,
  Type,
  X
} from "lucide-react";

const labels = {
  emoji: "\u7d75\u6587\u5b57OK",
  image: "\u753b\u50cf\u8cbc\u308a\u4ed8\u3051\u5bfe\u5fdc",
  imageUploadFailed: "\u753b\u50cf\u306e\u633f\u5165\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002",
  bold: "\u592a\u5b57",
  strike: "\u53d6\u308a\u6d88\u3057\u7dda",
  left: "\u5de6\u63c3\u3048",
  center: "\u4e2d\u592e\u63c3\u3048",
  right: "\u53f3\u63c3\u3048",
  table: "\u8868\u3092\u633f\u5165",
  color: "\u6587\u5b57\u8272",
  cellColor: "\u30bb\u30eb\u306e\u8272",
  size: "\u6587\u5b57\u30b5\u30a4\u30ba",
  rows: "\u884c",
  columns: "\u5217",
  insert: "\u633f\u5165",
  other: "\u305d\u306e\u4ed6",
  hex: "\u8272\u30b3\u30fc\u30c9",
  selectCell:
    "\u8272\u3092\u4ed8\u3051\u305f\u3044\u30bb\u30eb\u3092\u30af\u30ea\u30c3\u30af\u3001\u307e\u305f\u306f\u30c9\u30e9\u30c3\u30b0\u3067\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002"
};

const defaultColors = [
  "#c00000",
  "#ff0000",
  "#ffc000",
  "#ffff00",
  "#92d050",
  "#00b050",
  "#00b0f0",
  "#0070c0",
  "#002060",
  "#7030a0"
];

const themeColorColumns = [
  ["#ffffff", "#f2f2f2", "#d9d9d9", "#bfbfbf", "#808080", "#595959"],
  ["#000000", "#7f7f7f", "#595959", "#3f3f3f", "#262626", "#0d0d0d"],
  ["#e7e6e6", "#d0cece", "#aeaaaa", "#757171", "#3a3838", "#171717"],
  ["#d9eaf7", "#bdd7ee", "#9dc3e6", "#5b9bd5", "#2f75b5", "#1f4e79"],
  ["#dbeef3", "#b7dde8", "#92cddc", "#31859b", "#205867", "#153a44"],
  ["#fce4d6", "#f8cbad", "#f4b183", "#c65911", "#833c0c", "#552800"],
  ["#e2f0d9", "#c6e0b4", "#a9d18e", "#70ad47", "#548235", "#375623"],
  ["#ddebf7", "#9dc3e6", "#5b9bd5", "#0070c0", "#005a9e", "#003f6f"],
  ["#f4cccc", "#ea9999", "#e06666", "#cc0000", "#990000", "#660000"],
  ["#eadcf8", "#d5a6f2", "#b565d9", "#8e24aa", "#6a1b9a", "#4a148c"]
];

const emojiGroups = [
  {
    label: "顔",
    items: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤑",
      "🤗",
      "🤭",
      "🫢",
      "🫣",
      "🤫",
      "🤔",
      "🫡",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😔",
      "😪",
      "🤤",
      "😴",
      "😷",
      "🤒",
      "🤕",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "🥴",
      "😵",
      "🤯",
      "🥳",
      "🥸",
      "😎",
      "🤓",
      "🧐",
      "😕",
      "🫤",
      "😟",
      "🙁",
      "☹️",
      "😮",
      "😯",
      "😲",
      "😳",
      "🥺",
      "🥹",
      "😦",
      "😧",
      "😨",
      "😰",
      "😥",
      "😢",
      "😭",
      "😱",
      "😖",
      "😣",
      "😞",
      "😓",
      "😩",
      "😫",
      "🥱",
      "😤",
      "😡",
      "😠",
      "🤬"
    ]
  },
  {
    label: "人",
    items: [
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👌",
      "🤌",
      "🤏",
      "✌️",
      "🤞",
      "🫰",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "☝️",
      "👍",
      "👎",
      "✊",
      "👊",
      "🤛",
      "🤜",
      "👏",
      "🙌",
      "🫶",
      "👐",
      "🤲",
      "🤝",
      "🙏",
      "✍️",
      "💪",
      "🦾",
      "🧠",
      "🫀",
      "🫁",
      "👀",
      "👁️",
      "👅",
      "👄",
      "👶",
      "🧒",
      "👦",
      "👧",
      "🧑",
      "👱",
      "👨",
      "🧔",
      "👩",
      "🧓",
      "👴",
      "👵",
      "🙍",
      "🙎",
      "🙅",
      "🙆",
      "💁",
      "🙋",
      "🧏",
      "🙇",
      "🤦",
      "🤷",
      "👮",
      "🥷",
      "👷",
      "🫅",
      "🤴",
      "👸",
      "👼",
      "🎅",
      "🧙",
      "🧚",
      "🧛",
      "🧜",
      "🧝",
      "🧞",
      "🧟",
      "💃",
      "🕺"
    ]
  },
  {
    label: "動物",
    items: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐻‍❄️",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🙈",
      "🙉",
      "🙊",
      "🐒",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🪱",
      "🐛",
      "🦋",
      "🐌",
      "🐞",
      "🐜",
      "🪰",
      "🪲",
      "🪳",
      "🦟",
      "🦗",
      "🕷️",
      "🦂",
      "🐢",
      "🐍",
      "🦎",
      "🦖",
      "🦕",
      "🐙",
      "🦑",
      "🦐",
      "🦞",
      "🦀",
      "🐡",
      "🐠",
      "🐟",
      "🐬",
      "🐳",
      "🐋",
      "🦈",
      "🐊",
      "🐅",
      "🐆",
      "🦓",
      "🦍",
      "🦧",
      "🐘",
      "🦛",
      "🦏",
      "🐪",
      "🦒",
      "🐃",
      "🐂",
      "🐄",
      "🐎",
      "🐖",
      "🐏",
      "🐑",
      "🦙",
      "🐐",
      "🦌"
    ]
  },
  {
    label: "食べ物",
    items: [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🫒",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥯",
      "🍞",
      "🥖",
      "🥨",
      "🧀",
      "🥚",
      "🍳",
      "🧈",
      "🥞",
      "🧇",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
      "🥪",
      "🥙",
      "🧆",
      "🌮",
      "🌯",
      "🫔",
      "🥗",
      "🥘",
      "🫕",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍱",
      "🥟",
      "🦪",
      "🍤",
      "🍙",
      "🍚",
      "🍘",
      "🍥",
      "🥠",
      "🥮",
      "🍢",
      "🍡",
      "🍧",
      "🍨",
      "🍦",
      "🥧",
      "🧁",
      "🍰",
      "🎂",
      "🍮",
      "🍭",
      "🍬",
      "🍫",
      "🍿",
      "🍩",
      "🍪"
    ]
  },
  {
    label: "活動",
    items: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "🎽",
      "🛹",
      "🛼",
      "🛷",
      "⛸️",
      "🥌",
      "🎿",
      "⛷️",
      "🏂",
      "🪂",
      "🏋️",
      "🤼",
      "🤸",
      "⛹️",
      "🤺",
      "🤾",
      "🏌️",
      "🏇",
      "🧘",
      "🏄",
      "🏊",
      "🤽",
      "🚣",
      "🧗",
      "🚵",
      "🚴",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🏅",
      "🎖️",
      "🏵️",
      "🎗️",
      "🎫",
      "🎟️",
      "🎪",
      "🤹",
      "🎭",
      "🩰",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎼",
      "🎹",
      "🥁",
      "🎷",
      "🎺",
      "🪗",
      "🎸",
      "🪕",
      "🎻",
      "🎲",
      "♟️",
      "🎯",
      "🎳",
      "🎮"
    ]
  },
  {
    label: "旅行",
    items: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚐",
      "🛻",
      "🚚",
      "🚛",
      "🚜",
      "🦯",
      "🦽",
      "🦼",
      "🛴",
      "🚲",
      "🛵",
      "🏍️",
      "🛺",
      "🚨",
      "🚔",
      "🚍",
      "🚘",
      "🚖",
      "🚡",
      "🚠",
      "🚟",
      "🚃",
      "🚋",
      "🚞",
      "🚝",
      "🚄",
      "🚅",
      "🚈",
      "🚂",
      "🚆",
      "🚇",
      "🚊",
      "🚉",
      "✈️",
      "🛫",
      "🛬",
      "🛩️",
      "💺",
      "🛰️",
      "🚀",
      "🛸",
      "🚁",
      "🛶",
      "⛵",
      "🚤",
      "🛥️",
      "🛳️",
      "⛴️",
      "🚢",
      "⚓",
      "🛟",
      "🗿",
      "🗽",
      "🗼",
      "🏰",
      "🏯",
      "🏟️",
      "🎡",
      "🎢",
      "⛲",
      "⛱️",
      "🏖️",
      "🏝️",
      "🏜️",
      "🌋",
      "⛰️",
      "🏔️",
      "🗻",
      "🏕️",
      "⛺",
      "🏠"
    ]
  },
  {
    label: "物",
    items: [
      "⌚",
      "📱",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "🖱️",
      "🖲️",
      "🕹️",
      "🗜️",
      "💽",
      "💾",
      "💿",
      "📀",
      "📼",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📽️",
      "🎞️",
      "📞",
      "☎️",
      "📟",
      "📠",
      "📺",
      "📻",
      "🎙️",
      "🎚️",
      "🎛️",
      "🧭",
      "⏱️",
      "⏲️",
      "⏰",
      "🕰️",
      "⌛",
      "⏳",
      "📡",
      "🔋",
      "🪫",
      "🔌",
      "💡",
      "🔦",
      "🕯️",
      "🪔",
      "🧯",
      "🛢️",
      "💸",
      "💵",
      "💴",
      "💶",
      "💷",
      "🪙",
      "💰",
      "💳",
      "💎",
      "⚖️",
      "🪜",
      "🧰",
      "🪛",
      "🔧",
      "🔨",
      "⚒️",
      "🛠️",
      "⛏️",
      "🪚",
      "🔩",
      "⚙️",
      "🪤",
      "🧱",
      "⛓️",
      "🧲",
      "🔫",
      "💣",
      "🧨",
      "🪓",
      "🔪",
      "🗡️",
      "🛡️",
      "🚬",
      "⚰️",
      "🪦"
    ]
  },
  {
    label: "記号",
    items: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
      "🈶",
      "🈚",
      "🈸",
      "🈺",
      "🈷️",
      "✴️",
      "🆚",
      "💮",
      "🉐",
      "㊙️",
      "㊗️",
      "🈴",
      "🈵",
      "🈹",
      "🈲",
      "🅰️",
      "🅱️",
      "🆎",
      "🆑",
      "🅾️",
      "🆘",
      "❌",
      "⭕",
      "🛑",
      "⛔",
      "📛",
      "🚫",
      "💯",
      "💢",
      "♨️",
      "🚷",
      "🚯",
      "🚳",
      "🚱",
      "🔞",
      "📵",
      "🚭",
      "❗",
      "❕",
      "❓",
      "❔",
      "‼️",
      "⁉️",
      "🔅",
      "🔆",
      "⚠️",
      "🚸",
      "🔱",
      "⚜️",
      "🔰",
      "♻️",
      "✅",
      "🈯",
      "💹",
      "❇️",
      "✳️",
      "❎"
    ]
  },
  {
    label: "旗",
    items: [
      "🏳️",
      "🏴",
      "🏁",
      "🚩",
      "🏳️‍🌈",
      "🏳️‍⚧️",
      "🇯🇵",
      "🇺🇸",
      "🇨🇳",
      "🇰🇷",
      "🇬🇧",
      "🇫🇷",
      "🇩🇪",
      "🇮🇹",
      "🇪🇸",
      "🇵🇹",
      "🇧🇷",
      "🇨🇦",
      "🇦🇺",
      "🇳🇿",
      "🇸🇬",
      "🇹🇭",
      "🇻🇳",
      "🇵🇭",
      "🇮🇩",
      "🇲🇾",
      "🇮🇳",
      "🇹🇼",
      "🇭🇰",
      "🇲🇴",
      "🇲🇽",
      "🇦🇷",
      "🇨🇱",
      "🇵🇪",
      "🇨🇴",
      "🇿🇦",
      "🇪🇬",
      "🇹🇷",
      "🇸🇦",
      "🇦🇪",
      "🇮🇱",
      "🇺🇦",
      "🇵🇱",
      "🇳🇱",
      "🇧🇪",
      "🇨🇭",
      "🇦🇹",
      "🇸🇪",
      "🇳🇴",
      "🇩🇰",
      "🇫🇮",
      "🇮🇪",
      "🇬🇷",
      "🇷🇺"
    ]
  },
  {
    label: "顔文字",
    items: [
      "(｀・ω・´)",
      "( ´ ▽ ` )ﾉ",
      "(｡･ω･｡)",
      "(๑•̀ㅂ•́)و✧",
      "m(_ _)m",
      "(>_<)",
      "(；・∀・)",
      "(*´∀｀*)",
      "(￣▽￣)",
      "(＾▽＾)",
      "(≧▽≦)",
      "٩(ˊᗜˋ*)و",
      "(ง •̀_•́)ง",
      "(╯°□°）╯︵ ┻━┻",
      "┬─┬ ノ( ゜-゜ノ)",
      "(´・ω・｀)",
      "(；ω；)",
      "(T_T)",
      "＼(^o^)／",
      "＼( 'ω')／",
      "( ˘ω˘ )",
      "(・_・;)",
      "(汗)",
      "(笑)",
      "orz",
      "＿|￣|○",
      "(๑˃̵ᴗ˂̵)",
      "(๑•̀ㅁ•́๑)✧",
      "(っ´ω`)っ",
      "Σ(ﾟДﾟ)",
      "(ﾟ∀ﾟ)",
      "(¬_¬)",
      "(눈_눈)",
      "(´；ω；｀)",
      "(ﾉ´ヮ`)ﾉ*:･ﾟ✧",
      "(*^▽^*)",
      "(=^･ω･^=)",
      "( ˙꒳​˙ )",
      "(๑´ڡ`๑)"
    ]
  }
];

const emojiChoices = emojiGroups.flatMap((group) => group.items);

type AdminRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  help: string;
  placeholder: string;
};

export function AdminRichTextEditor({
  value,
  onChange,
  help,
  placeholder
}: AdminRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const emojiMenuRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const lastExternalValue = useRef(value);
  const dragStartCellRef = useRef<HTMLTableCellElement | null>(null);
  const [textColor, setTextColor] = useState("#0f172a");
  const [textCustomColor, setTextCustomColor] = useState("#0f172a");
  const [cellCustomColor, setCellCustomColor] = useState("#16a34a");
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [selectedEmojiGroup, setSelectedEmojiGroup] = useState(emojiGroups[0].label);
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showCellColorMenu, setShowCellColorMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(3);
  const [selectedCells, setSelectedCells] = useState<HTMLTableCellElement[]>([]);
  const [isSelectingCells, setIsSelectingCells] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    strikeThrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false
  });
  const selectedEmojiChoices =
    emojiGroups.find((group) => group.label === selectedEmojiGroup)?.items ?? emojiChoices;

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML || !value) {
      return;
    }

    editorRef.current.innerHTML = toEditorHtml(value);
    lastExternalValue.current = value;
  }, [value]);

  useEffect(() => {
    if (!editorRef.current || lastExternalValue.current === value) {
      return;
    }

    if (getCleanEditorHtml() !== value) {
      editorRef.current.innerHTML = toEditorHtml(value);
      clearSelectedCells();
    }
    lastExternalValue.current = value;
  }, [value]);

  useEffect(() => {
    if (!showEmojiMenu) {
      return;
    }

    function handleEmojiOutsidePointerDown(event: globalThis.PointerEvent) {
      if (!emojiMenuRef.current?.contains(event.target as Node)) {
        setShowEmojiMenu(false);
      }
    }

    document.addEventListener("pointerdown", handleEmojiOutsidePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handleEmojiOutsidePointerDown, true);
  }, [showEmojiMenu]);

  useEffect(() => {
    if (!showTableMenu) {
      return;
    }

    function handleTableOutsideClick(event: globalThis.MouseEvent) {
      if (!tableMenuRef.current?.contains(event.target as Node)) {
        setShowTableMenu(false);
      }
    }

    window.addEventListener("mousedown", handleTableOutsideClick);
    return () => window.removeEventListener("mousedown", handleTableOutsideClick);
  }, [showTableMenu]);

  function getCleanEditorHtml() {
    if (!editorRef.current) {
      return "";
    }

    const clone = editorRef.current.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".notice-selected-cell").forEach((cell) => {
      cell.classList.remove("notice-selected-cell");
    });
    return clone.innerHTML;
  }

  function syncValue() {
    const nextValue = getCleanEditorHtml();
    lastExternalValue.current = nextValue;
    onChange(nextValue);
    updateToolbarState();
  }

  function saveSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
    }
  }

  function restoreSelection() {
    const range = savedRangeRef.current;
    if (!range) {
      editorRef.current?.focus();
      return;
    }

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  function updateToolbarState() {
    if (typeof document === "undefined") {
      return;
    }

    setActiveFormats({
      bold: document.queryCommandState("bold"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight")
    });
  }

  function collapseSelectionToEnd() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      return;
    }

    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function runCommand(command: string, commandValue?: string, collapseAfter = true) {
    restoreSelection();
    document.execCommand(command, false, commandValue);
    if (collapseAfter) {
      collapseSelectionToEnd();
    }
    saveSelection();
    syncValue();
    updateToolbarState();
  }

  function insertEmoji(value: string) {
    runCommand("insertText", value);
  }

  function openEmojiPicker() {
    saveSelection();
    setShowEmojiMenu(true);
    setShowTextColorMenu(false);
    setShowCellColorMenu(false);
    setShowTableMenu(false);
  }

  function openImagePicker() {
    saveSelection();
    setShowEmojiMenu(false);
    imageInputRef.current?.click();
  }

  function openTableMenu() {
    saveSelection();
    setShowTableMenu(true);
    setShowEmojiMenu(false);
    setShowTextColorMenu(false);
    setShowCellColorMenu(false);
  }

  function openCellColorMenu() {
    saveSelection();
    setShowCellColorMenu(true);
    setShowEmojiMenu(false);
    setShowTextColorMenu(false);
    setShowTableMenu(false);
  }

  function openTextColorMenu() {
    saveSelection();
    setShowTextColorMenu(true);
    setShowEmojiMenu(false);
    setShowCellColorMenu(false);
    setShowTableMenu(false);
  }

  async function insertImageFile(file: File) {
    setIsUploadingImage(true);
    try {
      const data = await uploadInlineImage(file);
      insertInlineImage(data.url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : labels.imageUploadFailed);
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleImageInputChange(file: File | null) {
    if (!file) {
      return;
    }

    await insertImageFile(file);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function insertInlineImage(url: string) {
    runCommand(
      "insertHTML",
      `<p><img src="${escapeAttribute(url)}" alt="inline-image" class="notice-inline-image"></p>`
    );
  }

  function applyTextColor(nextColor: string) {
    setTextColor(nextColor);
    setTextCustomColor(nextColor);
    setShowEmojiMenu(false);
    setShowTextColorMenu(false);
    setShowCellColorMenu(false);
    runCommand("foreColor", nextColor);
  }

  function applyCellColor(nextColor: string) {
    if (selectedCells.length === 0) {
      return;
    }

    selectedCells.forEach((cell) => {
      cell.style.backgroundColor = nextColor;
    });
    setCellCustomColor(nextColor);
    setShowEmojiMenu(false);
    setShowCellColorMenu(false);
    setShowTextColorMenu(false);
    syncValue();
  }

  function insertTable() {
    const rowCount = clampNumber(rows, 1, 20);
    const columnCount = clampNumber(columns, 1, 10);
    const tableRows = Array.from({ length: rowCount }, () => {
      const cells = Array.from(
        { length: columnCount },
        () => '<td style="min-width:96px;width:120px;height:38px;">&nbsp;</td>'
      ).join("");
      return `<tr>${cells}</tr>`;
    }).join("");

    runCommand(
      "insertHTML",
      `<div class="notice-table-scroll" style="width:640px;height:auto;"><table class="notice-rich-table"><tbody>${tableRows}</tbody></table></div><p><br></p>`,
      false
    );
    setShowTableMenu(false);
    setShowEmojiMenu(false);
  }

  function clearSelectedCells() {
    editorRef.current?.querySelectorAll(".notice-selected-cell").forEach((cell) => {
      cell.classList.remove("notice-selected-cell");
    });
    setSelectedCells([]);
  }

  function selectCells(cells: HTMLTableCellElement[]) {
    clearSelectedCells();
    cells.forEach((cell) => cell.classList.add("notice-selected-cell"));
    setSelectedCells(cells);
  }

  function getCellFromEvent(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const cell = target.closest("td,th") as HTMLTableCellElement | null;
    return cell && editorRef.current?.contains(cell) ? cell : null;
  }

  function getCellRange(startCell: HTMLTableCellElement, endCell: HTMLTableCellElement) {
    const startTable = startCell.closest("table");
    const endTable = endCell.closest("table");
    if (!startTable || startTable !== endTable) {
      return [endCell];
    }

    const startRow = startCell.parentElement as HTMLTableRowElement;
    const endRow = endCell.parentElement as HTMLTableRowElement;
    const minRow = Math.min(startRow.rowIndex, endRow.rowIndex);
    const maxRow = Math.max(startRow.rowIndex, endRow.rowIndex);
    const minColumn = Math.min(startCell.cellIndex, endCell.cellIndex);
    const maxColumn = Math.max(startCell.cellIndex, endCell.cellIndex);
    const cells: HTMLTableCellElement[] = [];

    Array.from(startTable.rows).forEach((row) => {
      if (row.rowIndex < minRow || row.rowIndex > maxRow) {
        return;
      }

      Array.from(row.cells).forEach((cell) => {
        if (cell.cellIndex >= minColumn && cell.cellIndex <= maxColumn) {
          cells.push(cell as HTMLTableCellElement);
        }
      });
    });

    return cells;
  }

  function handleEditorPointerDown() {
    setShowEmojiMenu(false);
  }

  function handleEditorMouseDown(event: MouseEvent<HTMLDivElement>) {
    setShowEmojiMenu(false);
    const cell = getCellFromEvent(event);
    if (!cell) {
      clearSelectedCells();
      return;
    }

    dragStartCellRef.current = cell;
    setIsSelectingCells(true);
    selectCells([cell]);
    saveSelection();
  }

  function handleEditorMouseOver(event: MouseEvent<HTMLDivElement>) {
    if (!isSelectingCells || !dragStartCellRef.current) {
      return;
    }

    const cell = getCellFromEvent(event);
    if (!cell) {
      return;
    }

    selectCells(getCellRange(dragStartCellRef.current, cell));
  }

  function handleEditorMouseUp() {
    setIsSelectingCells(false);
    dragStartCellRef.current = null;
    saveSelection();
    updateToolbarState();
  }

  async function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const image = Array.from(event.clipboardData.files).find((file) =>
      file.type.startsWith("image/")
    );
    if (!image) {
      return;
    }

    event.preventDefault();
    setShowEmojiMenu(false);
    await insertImageFile(image);
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div ref={emojiMenuRef} className="relative">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={openEmojiPicker}
            title={labels.emoji}
            aria-label={labels.emoji}
            aria-expanded={showEmojiMenu}
            className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 transition hover:bg-cyan-100"
          >
            <SmilePlus size={14} />
            {labels.emoji}
          </button>
          {showEmojiMenu ? (
            <div className="absolute left-0 top-full z-30 mt-2 w-[min(88vw,28rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
              <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
                {emojiGroups.map((group) => (
                  <button
                    key={group.label}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSelectedEmojiGroup(group.label)}
                    aria-pressed={selectedEmojiGroup === group.label}
                    className={`h-8 shrink-0 rounded-lg px-2 text-xs font-black transition ${
                      selectedEmojiGroup === group.label
                        ? "bg-cyan-100 text-cyan-700"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
              <div
                className={`grid max-h-72 overflow-y-auto pr-1 ${
                  selectedEmojiGroup === "顔文字" ? "grid-cols-2 gap-1.5" : "grid-cols-8 gap-1"
                }`}
              >
                {selectedEmojiChoices.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertEmoji(item)}
                    title={item}
                    aria-label={`${labels.insert} ${item}`}
                    className={`min-h-10 rounded-xl px-2 text-center font-black text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700 ${
                      selectedEmojiGroup === "顔文字" ? "text-xs" : "text-xl"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={openImagePicker}
          disabled={isUploadingImage}
          title={labels.image}
          aria-label={labels.image}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
        >
          <ImagePlus size={14} />
          {labels.image}
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleImageInputChange(event.target.files?.[0] ?? null)}
        />
        <div className="relative ml-auto flex flex-wrap items-center justify-end gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
          <ToolButton
            label={labels.bold}
            active={activeFormats.bold}
            onClick={() => runCommand("bold")}
          >
            <Bold size={16} />
          </ToolButton>
          <ToolButton
            label={labels.strike}
            active={activeFormats.strikeThrough}
            onClick={() => runCommand("strikeThrough")}
          >
            <Strikethrough size={16} />
          </ToolButton>
          <ToolButton
            label={labels.left}
            active={activeFormats.justifyLeft}
            onClick={() => runCommand("justifyLeft")}
          >
            <AlignLeft size={16} />
          </ToolButton>
          <ToolButton
            label={labels.center}
            active={activeFormats.justifyCenter}
            onClick={() => runCommand("justifyCenter")}
          >
            <AlignCenter size={16} />
          </ToolButton>
          <ToolButton
            label={labels.right}
            active={activeFormats.justifyRight}
            onClick={() => runCommand("justifyRight")}
          >
            <AlignRight size={16} />
          </ToolButton>
          <div ref={tableMenuRef} className="relative">
            <ToolButton
              label={labels.table}
              onClick={openTableMenu}
            >
              <Table2 size={16} />
            </ToolButton>
            {showTableMenu ? (
              <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
                <PanelHeader title={labels.table} onClose={() => setShowTableMenu(false)} />
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label={labels.rows} value={rows} min={1} max={20} onChange={setRows} />
                  <NumberField
                    label={labels.columns}
                    value={columns}
                    min={1}
                    max={10}
                    onChange={setColumns}
                  />
                </div>
                <button
                  type="button"
                  onClick={insertTable}
                  className="mt-3 h-10 w-full rounded-xl bg-slate-900 text-sm font-black text-white hover:bg-slate-800"
                >
                  {labels.insert}
                </button>
              </div>
            ) : null}
          </div>
          <ColorMenu
            label={labels.cellColor}
            icon={<PaintBucket size={16} />}
            open={showCellColorMenu}
            onOpen={openCellColorMenu}
            onClose={() => setShowCellColorMenu(false)}
            color={cellCustomColor}
            setColor={setCellCustomColor}
            onApply={applyCellColor}
            footer={selectedCells.length === 0 ? labels.selectCell : undefined}
          />
          <ColorMenu
            label={labels.color}
            icon={<span className="text-sm font-black leading-none text-slate-700">A</span>}
            open={showTextColorMenu}
            onOpen={openTextColorMenu}
            onClose={() => setShowTextColorMenu(false)}
            color={textCustomColor}
            selectedColor={textColor}
            setColor={setTextCustomColor}
            onApply={applyTextColor}
          />
          <label className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-slate-600">
            <Type size={16} />
            <select
              aria-label={labels.size}
              onMouseDown={saveSelection}
              onChange={(event) => runCommand("fontSize", event.target.value)}
              className="bg-transparent text-xs font-black outline-none"
              defaultValue="3"
            >
              <option value="2">小</option>
              <option value="3">中</option>
              <option value="5">大</option>
              <option value="7">特大</option>
            </select>
          </label>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onPointerDownCapture={handleEditorPointerDown}
        onMouseDown={handleEditorMouseDown}
        onMouseOver={handleEditorMouseOver}
        onMouseUp={handleEditorMouseUp}
        onMouseLeave={handleEditorMouseUp}
        onKeyUp={() => {
          saveSelection();
          updateToolbarState();
        }}
        onFocus={() => {
          saveSelection();
          updateToolbarState();
        }}
        onPaste={handlePaste}
        className="notice-editor min-h-[360px] resize-y overflow-auto rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold leading-7 outline-none transition empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        data-placeholder={placeholder}
      />
      <span className="text-xs font-semibold text-muted">{help}</span>
    </div>
  );
}

function ColorMenu({
  label,
  icon,
  open,
  onOpen,
  onClose,
  color,
  selectedColor,
  setColor,
  onApply,
  footer
}: {
  label: string;
  icon: ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  color: string;
  selectedColor?: string;
  setColor: (value: string) => void;
  onApply: (value: string) => void;
  footer?: string;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(event: globalThis.MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose, open]);

  return (
    <div ref={menuRef} className="relative">
      <ToolButton label={label} onClick={onOpen}>
        {icon}
      </ToolButton>
      {open ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          <PanelHeader title={label} onClose={onClose} />
          <p className="mb-2 text-xs font-black text-slate-500">
            \u30c6\u30fc\u30de\u306e\u8272
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {themeColorColumns.flatMap((column, columnIndex) =>
              column.map((item, rowIndex) => (
                <button
                  key={`${item}-${columnIndex}-${rowIndex}`}
                  type="button"
                  onClick={() => onApply(item)}
                  className={`h-6 w-6 rounded-sm border border-slate-100 shadow-sm ${
                    selectedColor === item ? "ring-2 ring-cyan-500 ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: item }}
                  aria-label={item}
                />
              ))
            )}
          </div>
          <p className="mb-2 mt-3 text-xs font-black text-slate-500">
            \u6a19\u6e96\u306e\u8272
          </p>
          <div className="grid grid-cols-10 gap-1.5">
            {defaultColors.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onApply(item)}
                className={`h-6 w-6 rounded-sm border border-slate-100 shadow-sm ${
                  selectedColor === item ? "ring-2 ring-cyan-500 ring-offset-1" : ""
                }`}
                style={{ backgroundColor: item }}
                aria-label={item}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <label className="grid gap-1 text-xs font-black text-slate-500">
              {labels.hex}
              <input
                value={color}
                onChange={(event) => {
                  const nextColor = event.target.value;
                  setColor(nextColor);
                  if (/^#[0-9a-fA-F]{6}$/.test(nextColor)) {
                    onApply(nextColor);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && /^#[0-9a-fA-F]{6}$/.test(color)) {
                    event.preventDefault();
                    onApply(color);
                  }
                }}
                onBlur={() => {
                  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
                    onApply(color);
                  }
                }}
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-black text-ink outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
            <label className="relative mt-5 inline-flex h-10 items-center rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-600 hover:bg-slate-50">
              {labels.other}
              <input
                type="color"
                value={color}
                onChange={(event) => onApply(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label={labels.other}
              />
            </label>
          </div>
          {footer ? <p className="mt-2 text-xs font-bold text-rose-600">{footer}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-black text-ink">{title}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ToolButton({
  label,
  onClick,
  active = false,
  children
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
        active
          ? "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300"
          : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      {children}
    </button>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-black text-slate-500">
      {label}
      <input
        value={value}
        min={min}
        max={max}
        type="number"
        onChange={(event) => onChange(clampNumber(Number(event.target.value), min, max))}
        className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-black text-ink outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  );
}

function toEditorHtml(value: string) {
  if (!value) {
    return "";
  }

  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  return escapeHtml(value).replace(/\n/g, "<br>");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

async function uploadInlineImage(file: File) {
  const formData = new FormData();
  formData.set("image", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData
  });
  const data = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !data?.url) {
    throw new Error(data?.message || labels.imageUploadFailed);
  }

  return { url: data.url };
}
