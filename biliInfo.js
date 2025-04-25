// == content/biliInfo.js ==

import axios from 'axios'; // 引入 axios 库

export class BiliInfo {
  isInit = 0;

  async init() {
    if (this.isInit) return this;
    this.isInit = 1;
  
    // 通用提取函数
    const extract = (cookies, name) => cookies.find(c => c.name === name)?.value;
  
    try {
      if (chrome.cookies && chrome.cookies.getAll) {
        // background 或 popup 环境
        const cookies = await chrome.cookies.getAll({ domain: '.bilibili.com' });
  
        this.defaultCookie = `SESSDATA=${extract(cookies, 'SESSDATA')}`;
        this.upMid = extract(cookies, 'DedeUserID');
        this.jct_csrf = extract(cookies, 'bili_jct');
      } else {
        // content 环境：尝试 document.cookie（受 SameSite/HttpOnly 限制）
        const raw = document.cookie;
        const cookieObj = Object.fromEntries(raw.split('; ').map(c => c.split('=')));
  
        this.defaultCookie = `SESSDATA=${cookieObj['SESSDATA']}`;
        this.upMid = cookieObj['DedeUserID'];
        this.jct_csrf = cookieObj['bili_jct'];
      }
    } catch (e) {
      console.warn('cookie 获取失败，可能是权限问题。', e);
      // 最后兜底方式：发消息向 background 请求
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'get_bili_cookie' }, resolve);
      });
  
      this.defaultCookie = `SESSDATA=${response?.sessdata}`;
      this.upMid = response?.mid;
      this.jct_csrf = response?.bili_jct;
    }
  
    return this;
  }
  
  constructor() {
    // axios 实例
    this.axiosInstance = axios.create({
      headers: {
        'accept': '*/*',
        'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8,zh-TW;q=0.7,ja;q=0.6,ru;q=0.5',
        // 'origin': 'https://space.bilibili.com',
        //   'referer': 'https://space.bilibili.com/27189036/favlist?fid=51845836&ftype=create',
        // 'sec-ch-ua-mobile': '?0',
        // 'sec-ch-ua-platform': '"Windows"',
        // 'sec-fetch-dest': 'empty',
        // 'sec-fetch-mode': 'cors',
        // 'sec-fetch-site': 'same-site',
        // 'user-agent':
        //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      }
    });
  }

  // 获取所有收藏夹
  async fetchAllFolders() {
    try {
      console.log(this.upMid);
      if (!this.upMid) {
        return [{ status: 'error', message: '未获取到用户 ID，请检查登录状态' }];
      }
      else {
        console.log('获取到用户 ID:', this.upMid);
      }
      console.log(this.defaultCookie);
      if (!this.defaultCookie) {
        return [{ status: 'error', message: '未获取到登录 Cookie，请检查登录状态' }];
      }
      else {
        console.log('获取到登录 Cookie:', this.defaultCookie);
      }
      const res = await this.axiosInstance.get(
        'https://api.bilibili.com/x/v3/fav/folder/created/list-all',
        {
          params: {
            // upMid: this.upMid,
            up_mid: this.upMid,
          },
          headers: {
            cookie: this.defaultCookie,
          },
        }
      );

      if (res.data.code === 0) {
        return res.data
      } else {
        return [{ status: 'error', message: res.data.message }];
      }
    } catch (e) {
      return [{ status: 'error', message: `请求异常: ${e.message}` }];
    }
  }

  // 获取一个视频在所有收藏夹中结果
  async fetchAllFoldersWithVideo(aid) {
    try {
      console.log(this.upMid);
      if (!this.upMid) {
        return [{ status: 'error', message: '未获取到用户 ID，请检查登录状态' }];
      }
      else {
        console.log('获取到用户 ID:', this.upMid);
      }
      console.log(this.defaultCookie);
      if (!this.defaultCookie) {
        return [{ status: 'error', message: '未获取到登录 Cookie，请检查登录状态' }];
      }
      else {
        console.log('获取到登录 Cookie:', this.defaultCookie);
      }
      const res = await this.axiosInstance.get(
        'https://api.bilibili.com/x/v3/fav/folder/created/list-all',
        {
          params: {
            // upMid: this.upMid,
            up_mid: this.upMid,
            // type:2,
            rid: aid
            // bv_id:"BV1BUd7YbEwX"
          },
          headers: {
            cookie: this.defaultCookie,
          },
        }
      );

      if (res.data.code === 0) {
        return res.data
      } else {
        return [{ status: 'error', message: res.data.message }];
      }
    } catch (e) {
      return [{ status: 'error', message: `请求异常: ${e.message}` }];
    }
  }

  // this api does not  need seedata and userId necessarily 
  async fetchOneVideo(bvid) {
    try {
      console.log(this.upMid);


      console.log(this.defaultCookie);

      const res = await this.axiosInstance.get(
        'https://api.bilibili.com/x/web-interface/wbi/view',
        {
          params: {
            // upMid: this.upMid,
            // up_mid:this.upMid,
            // type:2,
            // rid:114299783610512
            // bv_id:"BV1BUd7YbEwX"
            bvid: bvid,
          },
          headers: {
            // cookie: this.defaultCookie,
          },
        }
      );

      if (res.data.code === 0) {
        return res.data
      } else {
        return [{ status: 'error', message: res.data.message }];
      }
    } catch (e) {
      return [{ status: 'error', message: `请求异常: ${e.message}` }];
    }
  }
  async changefav(aid, delList, addList) {
    try {

      console.log(this.upMid);
      console.log(this.defaultCookie);
      console.log(this.jct_csrf);
      const del_media_ids = delList.join(',');
      const add_media_ids = addList.join(',');
      console.log(del_media_ids);
      console.log(add_media_ids);
      const res = await this.axiosInstance.post(
        'https://api.bilibili.com/x/v3/fav/resource/deal', new URLSearchParams({
          rid: aid,
          type: '2',
          add_media_ids: add_media_ids,
          del_media_ids: del_media_ids,
          platform: 'web',
          csrf: this.jct_csrf,
          statistics: JSON.stringify({ appId: 100, platform: 5 })
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': this.defaultCookie 
          }
        }
      );
      console.log(res.request);

      if (res.data.code === 0) {
        return res.data
      } else {
        return [{ status: 'error', message: res.data.message }];
      }
    } catch (e) {
      return [{ status: 'error', message: `请求异常: ${e.message}` }];
    }
  }

}
