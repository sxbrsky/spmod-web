<?php
    namespace App\Model;

    use PDO;
    use App\Base\AbstractModel;

    class Builds extends AbstractModel
    {
        public function getBuild(string $build)
        {
            $sql = "SELECT * FROM {$this->table} INNER JOIN Commits ON Builds.commit_id = Commits.id WHERE builds.build = :build";
        
            try {
                $stmt = $this->getDatabase()->prepare($sql);
                $stmt->bindParam(":build", $build);
                $stmt->excute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }

        public function getBuilds()
        {
            $sql = "SELECT * FROM {$this->table} INNER JOIN Commits ON Builds.commit_id = Commits.id";
        
            try {
                $stmt = $this->getDatabase()->prepare($sql);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }

        public function save($commit_id, $build, $system, $version, $compiler, $type, $filename)
        {
            $sql = "INSERT INTO builds(`commit_id`, `build`, `system`, `version`, compiler, `type`, `filename` VALUES ?, ?, ?, ?, ?, ?, ?";

            return $this->getDatabase()->prepare($sql)->execute([$commit_id, $build, $system, $version, $compiler, $type, $filename]);
        }
    }