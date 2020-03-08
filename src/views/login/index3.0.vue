<template>
  <div id="login">
    <div class="login-wrap">
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
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
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
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            maxlength="20"
            minlength="6"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                v-model.number="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            >提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  stripscript,
  testJs,
  validateEmailReg,
  validatePasswordReg,
  validateCodeReg
} from "@/utils/validate";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
export default {
  name: "login",
  // setup(props, context) {
  setup(props, { refs }) {
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
        console.log(index);
      });
      data.current = true;
      model.value = data.type;
    };
    const submitForm = formName => {
      // context.refs[formName].validate(valid => {
      refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          testJs("error submit!!");
          return false;
        }
      });
    };

    //新的声明周期函数 挂载完成后
    onMounted(() => {});

    return {
      menuTab,
      model,
      ruleForm,
      rules,
      toggleMenu,
      submitForm
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
