// ประกาศให้ TypeScript รู้จักไฟล์ฟอนต์ .ttf
declare module '*.ttf' {
  const src: string;
  export default src;
}