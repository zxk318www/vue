/**
 * 登录接口 v1.0
 *
 */
import service from "@/utils/request";
/**
 * 获取验证码接口
 */
export function GetSms(data) {
  service.request({
    method: "post",
    url: "/getSms/",
    data //ES6 如果两者都是同名的情况下，写成单个
  });
}

/**
 * 获取登录用户角色接口
 */

/**
 * 登录 接口
 */

/**
 * 注册接口
 */
