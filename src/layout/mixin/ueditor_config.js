export const ueditor_config = {
  data() {
    return {
      ueditor_config: {
        autoHeightEnabled: false,
        autoFloatEnabled: true,
        initialFrameWidth: 800,
        initialFrameHeight: 300,
        UEDITOR_HOME_URL: process.env.VUE_APP_BASE_API + "/js/ueditor/",
      },
    };
  },
};
