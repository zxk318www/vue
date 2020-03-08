/**
 * 验证特殊字符串
 * @param {验证值} s
 */
export function stripscript(s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

export function testJs(params) {
  console.log(params);
}

/**
 * 验证邮箱
 * @param {邮箱值} params
 */
export function validateEmailReg(params) {
  let reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return !reg.test(params) ? false : true;
}

/**
 * 验证 密码格式
 * @param {密码值} params
 */
export function validatePasswordReg(params) {
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return !reg.test(params) ? false : true;
}

/**
 * 验证 验证码格式
 * @param {验证码值} params
 */
export function validateCodeReg(params) {
  let reg = /^[a-z0-9]{6}$/;
  return !reg.test(params) ? false : true;
}

//import {validateCodeReg ,validatePasswordReg} from '@/utils/validate'
