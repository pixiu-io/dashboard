import { defineStore, acceptHMRUpdate } from 'pinia';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { loginMethod } from '@/services/loginService';
import { router } from '@/router';

const useLoginStore = defineStore('login', () => {
  const loginFormRef = ref(null);
  const loading = ref(false);
  const loginInfo = ref({
    name: '',
    password: '',
  });
  const loginFn = () => {
    loginFormRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        // 发送登陆请求
        const [err, result] = await loginMethod(loginInfo.value);
        loading.value = false;
        if (err !== null) {
          return;
        }
        localStorage.setItem('token', result);
        localStorage.setItem('account', loginInfo.value.name);
        router.push('/index');
        ElMessage({
          message: '登录成功',
          type: 'success',
        });
      }
    });
  };
  const forgetFn = () => {
    ElMessage({
      message: '忘记密码，请联系管理员',
      type: 'error',
    });
  };
  return { loading, loginInfo, loginFormRef, loginFn, forgetFn };
});

// 开启对应的热更新支持
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoginStore, import.meta.hot));
}

export default useLoginStore;
