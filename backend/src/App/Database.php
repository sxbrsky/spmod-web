<?php
    namespace App\Base;

    use \PDO;
    
    class Database
    {
        protected $connection = null;

        public function __construct()
        {
            try {
                $this->connection = new PDO('sqlite:cache.sqlite3');
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                echo 'Connection failed: ' . $e->getMessage();
            }
        }

        public function getConnection() 
        {
            return $this->connection;
        }
    }