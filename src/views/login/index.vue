<template>
  <div id="login">
    <div class="login-wrap">
      <lottie
        :options="defaultOptions"
        :height="200"
        :width="200"
        v-on:animCreated="handleAnimation"
      />
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            maxlength="20"
            minlength="6"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            maxlength="20"
            minlength="6"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButton.status"
                >{{ codeButton.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >
            {{ model === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { GetSms, Register, Login } from "@/api/login";
import {
  stripscript,
  testJs,
  validateEmailReg,
  validatePasswordReg,
  validateCodeReg
} from "@/utils/validate";
import { reactive, ref, onMounted } from "@vue/composition-api";
import * as animationData from "@/assets/lottie/back.json";
export default {
  name: "login",
  //Vue 3.0语法
  // setup(props, context) {
  setup(props, { refs, root }) {
    //3.0 这里放置 data数据 、生命周期函数、自定义函数
    //对象 用reactive声明
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // console.log(menuTab);
    //模块值 ref 声明基础数据类型，取值、赋值 XX.value = xxx
    const model = ref("login");
    // console.log(model.value);

    //登录。注册按钮
    const loginButtonStatus = ref(true);
    const defaultOptions = { animationData: animationData.default };
    const animationSpeed = 1;
    let anim = {};

    //倒计时
    const timer = ref(null);

    const codeButton = reactive({
      status: false,
      text: "获取验证码"
    });

    //表单
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!validateEmailReg(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      testJs(value);
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      testJs(value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePasswordReg(value)) {
        callback(new Error("密码为6至20位的数字+字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //如果模块 是login 则直接跳过验证
      if (model.value === "login") {
        callback();
      }
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      testJs(value);
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("两次密码不相等"));
      } else {
        callback();
      }
    };

    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (!validateCodeReg(value)) {
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    let handleAnimation = ob => {
      anim = ob;
    };

    //表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });

    //判断是否是ref类型
    // console.log(isRef(model) ? "是基础类型" : "是对象类型");

    // const obj = reactive({
    //   x: 0,
    //   y: 1
    // });
    // const aa = toRefs(obj);
    // console.log(aa.y.value);

    //声明函数
    const toggleMenu = data => {
      menuTab.forEach((ele, index) => {
        ele.current = false;
        //console.log(index);
      });
      data.current = true;
      model.value = data.type;
      resetForm("ruleForm");
    };
    //提交
    const submitForm = formName => {
      // toggleMenu(menuTab[0]);
      // clearCountDown();
      // return false;
      // context.refs[formName].validate(valid => {
      refs[formName].validate(valid => {
        if (valid) {
          let requestData = {
            username: ruleForm.username,
            password: ruleForm.password,
            code: ruleForm.code
          };
          if (model.value === "login") {
            Login(requestData)
              .then(response => {
                console.log(response);
                let data = response.data;
                root.$message({
                  message: data.message,
                  type: "success"
                });
                if (data.resCode == 0) {
                  //跳转首页
                  root.$router.push("/index");
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            //注册接口
            Register(requestData)
              .then(response => {
                console.log(response);
                let data = response.data;
                root.$message({
                  message: data.message,
                  type: "success"
                });
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          testJs("error submit!!");
          return false;
        }
      });
      // });
    };
    //重置表单
    const resetForm = formName => {
      refs[formName].resetFields();
    };

    //倒计时
    const codeDown = value => {
      //先判断定时器是否存在，不存在则先清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      //1. setTimeout()执行一次
      //2. setInterval 不断执行，需要条件才会停止
      timer.value = setInterval(() => {
        value--;
        if (value === 0) {
          //1.清除定时 setTimeout.clearTimeout(变量)
          //2.清除定时 setInterval.clearInterval(变量)
          clearInterval(timer.value);
          codeButton.text = "再次获取";
          codeButton.status = false;
        } else {
          codeButton.text = `倒计时${value}秒`;
        }
      }, 1000);
    };

    //清除倒计时
    const clearCountDown = () => {
      //还原获取验证按钮
      codeButton.status = false;
      codeButton.text = "获取验证码";
      //清除倒计时
      clearInterval(timer.value);
    };

    //获取验证码
    const getSms = () => {
      //判断邮箱
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }
      if (!validateEmailReg(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入");
        return false;
      }
      //请求参数
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      //获取验证码 按钮禁用
      codeButton.status = true;
      codeButton.text = "发送中";

      setTimeout(() => {
        //获取验证码接口请求
        GetSms(requestData)
          .then(response => {
            //Promise.resolve
            let data = response.data;
            console.log(response);
            root.$message({
              message: data.message,
              type: "success"
            });
            //调用定时器，倒计时 启用登录或者注册按钮
            loginButtonStatus.value = false;
            codeDown(60);
          })
          .catch(error => {
            //Promise.reject
            console.log(error);
          });
      }, 2000);
    };

    //新的声明周期函数 挂载完成后
    onMounted(() => {});

    return {
      menuTab,
      model,
      loginButtonStatus,
      timer,
      codeButton,
      ruleForm,
      rules,
      toggleMenu,
      codeDown,
      submitForm,
      resetForm,
      clearCountDown,
      getSms,
      defaultOptions,
      animationSpeed,
      anim,
      handleAnimation
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 15px;
    color: #ffffff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 3px;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
