# 餐廳論壇 (Restaurant Forum)
ALPHA Camp Dev C4後端 M4 ~ M7 作業專案。

## 功能 (Features)
### 前台
- 使用者可以註冊/登入/登出網站
- 使用者可以在瀏覽所有餐廳與個別餐廳詳細資料
- 在瀏覽所有餐廳資料時，可以用分類篩選餐廳
- 使用者可以對餐廳留下評論
- 網站管理者可以刪除評論
- 使用者可以收藏餐廳
- 使用者可以查看最新上架的 10 筆餐廳
- 使用者可以查看最新的 10 筆評論
- 使用者可以編輯自己的個人資料
- 使用者可以查看自己評論過、收藏過的餐廳
- 使用者可以追蹤其他的使用者
- 使用者可以查看自己追蹤中的使用者與正在追蹤自己的使用者
### 後台
- 只有網站管理者可以登入網站後台
- 網站管理者可以在後台管理餐廳的基本資料
- 網站管理者可以在後台管理餐廳分類
- 網站管理者可以在後台管理使用者的權限

## 執行環境 (RTE)
[Node.js](https://nodejs.org/) (v14.16.0)  
[MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0.35)  
ℹ️ *執行此專案前，需安裝 Node.js 與 MySQL。*

## 安裝 (Installation)
1. 開啟終端機 (Terminal)，cd 至存放本專案的資料夾，執行以下指令將本專案 clone 至本機電腦。

```
git clone https://github.com/yac0928/forum-express-grading-github-actions.git
```

2. 進入此專案資料夾

```
cd forum-express-grading-github-actions
```

3. 執行以下指令以安裝套件

```
npm install
```

4. 資料庫設定  
請自行建立資料庫

--- MySQL server 連線之預設設定如下：
```
host: '127.0.0.1'  // localhost
username: 'root'
password: 'password'
database: 'forum'
```
接著進行資料表建立、種子資料匯入
```
npx sequelize db:migrate
```
```
npm sequelize db:seed:all
```

5. 環境變數設定

請參照根目錄下的 `.env.example` 檔，於根目錄下新增 `.env` 檔並進行相關設定：
```
SESSION_SECRET= 【 請自行設定 】
JWT_SECRET= 【 請自行設定 】

```
請自行設定 SESSION_SECRET、JWT_SECRET。  

6. 啟動伺服器

啟動伺服器前，請先確認環境變數 NODE_ENV **非** `production`，再執行以下指令以啟動伺服器：

```
npm run start
```

當 Terminal 出現以下字樣，即代表伺服器啟動成功：  
`Example app running on http://localhost:3000`  
現在，您可開啟任一瀏覽器輸入 http://localhost:3000 來使用餐廳清單網頁。  
  
種子資料提供以下兩組帳號密碼可使用：
- 帳號 1（有管理者權限）：root@example.com / 密碼：12345678
- 帳號 2（一般用戶）：user1@example.com / 密碼：12345678

7. API 操作相關說明  
本專案提供 API 版本，路由說明請見 [餐廳論壇API文件](https://tricolor-drink-8e5.notion.site/API-55017a992a4f40bc9d42937c68041220#7577e7112744486e904c471e74d3975c)   
進行各項 API 功能操作前，需先透過 `POST /api/signin` 進行登入。  
Request body：  
```
{
    "email": "[使用者帳號]",
    "password": "[使用者密碼]"
}
```
登入成功後，回傳成功訊息範例如下：
```
{
    "status": "success",
    "data": {
        "token": "[user token (string)]",
        "user": "[user data (object)]"
    }
}
```
請保存使用者 token，操作其他 API 時須以此 token 進行 Bearer Token authorization。  
Token 有效期限為 30 天。


## 使用工具 (Tools)
- 開發環境：[Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- 應用程式框架：[Express v4.17.1](https://www.npmjs.com/package/express)
- 樣版引擎：[Express-Handlebars v5.3.3](https://www.npmjs.com/package/express-handlebars)
- 資料庫套件：[mysql2 v2.3.0](https://www.npmjs.com/package/mysql2)
- ORM：[Sequelize v6.6.5 & Sequelize-CLI 6.2.0](https://sequelize.org/)
- HTTP method套件：[method-override v3.0.0](https://www.npmjs.com/package/method-override)
- 樣式框架：[Bootstrap v5.0.2](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- JWT驗證套件：[jsonwebtoken v8.5.1](https://www.npmjs.com/package/jsonwebtoken)

## 開發者 (Contributor)
[ALPHA Camp (上游專案)](https://github.com/ALPHACamp/forum-express-grading.git)  
[Yuan Chen](https://github.com/yac0928)