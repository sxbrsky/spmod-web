<?php
    namespace App\Base;

    use App\Base\Database;

    abstract class AbstractController
    {
        protected $db;
        
        public function __construct()
        {
            $this->db = new Database();
        }
    }