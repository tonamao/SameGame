<?php
class Helper
{
    private $url;
    private $config;

    protected static $singleton;

    protected function __construct()
    {
        $this->config    = include(__DIR__ . '/Config.php');
        $api_server_host = !is_null(getenv('API_SERVER_HOST')) ? getenv('API_SERVER_HOST') : $this->config['score_history']['api_server_host'];
        $api_server_port = !is_null(getenv('API_SERVER_PORT')) ? getenv('API_SERVER_PORT') : $this->config['score_history']['api_server_port'];
        $this->url       = 'http://'.$api_server_host.':'.$api_server_port;
    }

    public static function getInstance() {
        if (!isset(self::$singleton)) {
            self::$singleton = new Helper();
        }
        return self::$singleton;
    }

    /**
     * @param  Array $query_params
     * @return Array $score_history
     */
    public function get($query_params=null)
    {
        $url = $this->url.'/'.$this->config['score_history']['get_uri'];
        $query = static::_generateQuery($query_params);
        $url = $url.$query;

        //cURLセッションを初期化する
        $ch = curl_init();

        //URLとオプションを指定する
        curl_setopt($ch, CURLOPT_URL, $url);//取得するURL
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);//curl_exec()の返り値を文字列で返す。通常はデータを直接出力。

        //URLの情報を取得し、ブラウザに渡す
        $res =  curl_exec($ch);

        //結果を表示する
        $score_history = json_decode($res);

        //セッションを終了する
        curl_close($ch);
        return $score_history;
    }

    private function _generateQuery($query_params)
    {
        $query = '';
        if (!empty($query_params)) {
            return $query;
        }

        foreach ($query_params as $key => $param) {
            $concat = '&';
            if (end($param)) {
                $concat = '';
            }
            $query = $query.$key.'='.$param.$concat;
        }
        return '?'.$query;
    }
}
