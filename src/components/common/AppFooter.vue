<script setup lang="ts">
</script>

<template>
  <footer class="border-t border-[#E4E4E7] bg-[#FAFAFA]">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-6 h-6 text-[#18181B]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
            <span class="font-heading text-base font-semibold">MovieRec</span>
          </div>
          <p class="text-xs text-[#A1A1AA] leading-relaxed">智能电影推荐平台，用心为你发现好电影。</p>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4">快速链接</h4>
          <div class="space-y-2.5 text-sm text-[#52525B]">
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">关于我们</p>
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">帮助中心</p>
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">用户协议</p>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4">电影分类</h4>
          <div class="space-y-2.5 text-sm text-[#52525B]">
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">动作片</p>
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">科幻片</p>
            <p class="hover:text-[#18181B] cursor-pointer transition-colors duration-150">喜剧片</p>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-semibold mb-4">联系我们</h4>
          <div class="space-y-2.5 text-sm text-[#52525B]">
            <p>contact@movierec.com</p>
            <p>400-888-9999</p>
          </div>
        </div>
      </div>
      <div class="mt-10 pt-6 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-xs text-[#A1A1AA]">© 2026 MovieRec. All rights reserved.</p>
        <div class="flex gap-4 text-xs text-[#A1A1AA]">
          <a href="#" class="hover:text-[#18181B] transition-colors duration-150">隐私政策</a>
          <a href="#" class="hover:text-[#18181B] transition-colors duration-150">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>
