import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
    build: {
        outDir: "dist",  // 빌드된 JS 파일이 저장될 폴더ㅌ
        sourcemap: true, // 디버깅을 위한 소스맵 추가 (선택)
        emptyOutDir: true, // 빌드 전에 기존 파일 삭제
    },
});