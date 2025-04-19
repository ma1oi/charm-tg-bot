export const scenesConfig = {
  start: {
    images: ['https://example.com/image1.jpg'],
    keyboard: [
      { type: 'callback', key: 'btn_1', label: 'Button 1' },
      { type: 'callback', key: 'btn_2', label: 'Button 2' },
      { type: 'url', url: 'https://t.me/charm_support', label: 'Поддержка' }
    ]
  }
} as const;

export type SceneName = keyof typeof scenesConfig;
