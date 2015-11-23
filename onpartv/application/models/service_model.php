<?php

/**
 * Description of service
 *
 * @author 
 */
class Service_Model extends CI_Model {

	private $USER_TABLE = "sl_users";
	private $FILE_TABLE = "sl_files";
	private $SCHEDULE_TABLE = "sl_schedule";
	private $DEFAULT_TIME_ZONE = "America/New_York";

	public function updateAuthUser($user_id, $first_name, $last_name, $user_email, $new_password) {
		// duplicate state check
		$query_string = "SELECT * FROM " . $this->USER_TABLE;
		$query_string .= " WHERE user_email='" . $user_email . "' LIMIT 1";
		$query = $this->db->query($query_string);
		if ($query->num_rows()) {
			if ($user_id === "Auto") { //insert
				return array("result" => "WORNG_EMAIL");
			} else { //update 
				$dup = $query->result_array();
				if ($dup[0]['id'] !== $user_id) { //duplicate state
					return array("result" => "WORNG_EMAIL");
				}
			}
		}
		$data = array();
		$data['first_name'] = $first_name;
		$data['last_name'] = $last_name;
		$data['user_email'] = $user_email;
		if ($new_password)
			$data['user_password'] = $new_password;

		if ($user_id === "Auto") { // pre-define
			$data['user_password'] = $new_password;
			$data['ref_account'] = "1";
			$data['description'] = "1";
			$data['ref_design_area'] = "1";
			$this->db->insert($this->USER_TABLE, $data);
			$ret_id = $this->db->insert_id();
			if ($ret_id) {
				return array('result' => 'YES');
			} else {
				return array('result' => 'NO');
			}
		}

		$this->db->where("id", $user_id);
		$result = $this->db->update($this->USER_TABLE, $data);
		if ($result) {
			return array('result' => 'YES');
		} else {
			return array('result' => 'NO');
		}
	}

	/** Get all users from the user_table * */
	public function loginUser($user_email, $user_password) {
		if (!$this->db->table_exists($this->USER_TABLE)) {
//            echo $this->USER_TABLE;
			return array();
		}
		return $this->getValidateUser($user_email, $user_password);
	}

	/** Retrieve the user with the given name and password * */
	private function getValidateUser($user_email, $user_password) {
		$query_string = "SELECT * FROM " . $this->USER_TABLE;
		$query_string .= " WHERE user_email ='" . $user_email . "'";
		$query_string .= " AND user_password ='" . $user_password . "'";
		$query_string .= " LIMIT 1";
		$query = $this->db->query($query_string);
		$result = $query->row_array();

//        print_r($result);
		if ($query->num_rows() == 0) {
			return array('result' => 'NO');
		} else {
			return array('result' => 'YES', 'data' => $result);
		}
	}

	public function getUsers() {
		$result = $this->getAllUsers();
		return array('result' => 'YES', 'data' => $result);
	}

	private function getAllUsers() {
		$query_string = "SELECT * FROM " . $this->USER_TABLE;
		$query_string .= " WHERE user_email <> 'root'";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		return $result;
	}

	public function fileUpload($request_userid, $file_full_name, $file_origin_name, $file_type, $name_only, $play_time) {
//		echo "model part begin";
//		echo $request_userid . $file_full_name . $file_origin_name . $file_type;
		$data = array();
		$data['user_id'] = $request_userid;
		$data['file_name'] = $file_full_name;
		$data['name_only'] = $name_only;
		$data['origin_name'] = $file_origin_name;
		$data['file_type'] = $file_type;
		$query_string = "SELECT MAX( display_order ) AS max FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $request_userid;
		$query = $this->db->query($query_string);
		$result = $query->result_array();
//		echo "ORDER_MAX:";
		if (!$result[0]['max']) {
			$new_order = 1;
		} else {
			$new_order = $result[0]['max'] + 1;
//			var_dump($result[0]['max']);
		}
//		var_dump($new_order);
		date_default_timezone_set($this->DEFAULT_TIME_ZONE); // timezone setting
		$begin_date = date("Ymd");
		$end_date = date("Ymd");
		$create_date = date('Y-m-d H:i:s');

		$data['display_order'] = $new_order;
		$data['begin_date'] = $begin_date;
		$data['end_date'] = $end_date;
		$data['start_effect'] = "fadein"; // default
		$data['end_effect'] = "fadeout"; // default
		if ($play_time) {
			$data['stay_time'] = $play_time; // default time
		} else {
			$data['stay_time'] = 10; // default time
		}
		$data['create_date'] = $create_date;


		$this->db->insert($this->FILE_TABLE, $data);
		$ret_id = $this->db->insert_id();

		return array("result" => "YES", "ret_id" => $ret_id);
	}

	// get account user files // 
	public function getFiles($user_id) {
		$result = $this->getAllFiles($user_id);
		return array('result' => 'YES', 'data' => $result);
	}
	
	// get account user files // 
	public function getSlideFiles($user_id) {
		$result = $this->getAllSlideFiles($user_id);
		$result1 = $this->getDelFiles($user_id);
		return array('result' => 'YES', 'data' => $result, 'data1' => $result1);
	}

	private function getAllSlideFiles($user_id) {
		if (!$user_id)
			return;
		date_default_timezone_set($this->DEFAULT_TIME_ZONE);
		$query_string = "SELECT * FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $user_id;
		$query_string .= " AND `delete_date` IS NULL AND `begin_date` <= '" . date('Y-m-d') . "' AND `end_date` >= '" . date('Y-m-d') . "'";
		$query_string .= " ORDER BY `display_order`";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		for ($i = 0; $i < count($result); $i ++) {
			$result[$i]['thumb'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['name_only'] . "t.png";
			if ($result[$i]['file_type'] == 'video') {
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['name_only'] . '.mp4';
				$result[$i]['type'] = 'video';
			} else {
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['file_name'];
			}
		}
		return $result;
	}
	
	private function getAllFiles($user_id) {
		if (!$user_id)
			return;
		$query_string = "SELECT * FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $user_id;
		$query_string .= " AND `delete_date` IS NULL";
		$query_string .= " ORDER BY `display_order`";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		date_default_timezone_set($this->DEFAULT_TIME_ZONE);
		for ($i = 0; $i < count($result); $i ++) {
			$result[$i]['thumb'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['name_only'] . "t.png";
			if ($result[$i]['file_type'] == 'video') {
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['name_only'] . '.mp4';
				$result[$i]['type'] = 'video';
			} else {
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['file_name'];
			}
			$edary = explode("-", $result[$i]['end_date']);
			$edary1 = explode("-", $result[$i]['begin_date']);
			$edate = mktime(0, 0, 0, $edary[1], $edary[2], $edary[0]);
			$edate2 = mktime(0, 0, 0, $edary1[1], $edary1[2], $edary1[0]);
			$edate1 = mktime(0, 0, 0, date('m'), date('d'), date('Y'));
			if ($edate >= $edate1) {
				if ($edate2 > $edate1) {
					$result[$i]['class_name'] = 'red_border';
				} else {
					$result[$i]['class_name'] = 'green_border';
				}
			} else {
				$result[$i]['class_name'] = 'red_border';
			}
		}
		return $result;
	}
	
	private function getDelFiles($user_id) {
		if (!$user_id)
			return;
		date_default_timezone_set($this->DEFAULT_TIME_ZONE);
		$query_string = "SELECT * FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $user_id;
		$query_string .= " AND (`delete_date` IS NOT NULL OR `end_date` < '" . date('Y-m-d') . "')";
		$query_string .= " ORDER BY `display_order`";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		for ($i = 0; $i < count($result); $i ++) {
			$result[$i]['thumb'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['name_only'] . "t.png";
			$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['file_name'];
		}
		return $result;
	}

	public function deleteFile($id, $file_name) {
		$query_string = "SELECT file_name, file_type FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE `id` = " . $id;
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		foreach ($result as $item) {
			if ($item['file_type'] === "image") { // if image
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['file_name'];
				if (file_exists($targetFile)) {
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . "t.png";
				if (file_exists($targetFile)) {
					unlink($targetFile);
				}
			} else { // if video
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".mp4";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".webm";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".avi";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".ogg";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".png";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . "t.png";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
			}
		}
		// file record delete
		$query_string = "DELETE FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE `id`=" . $id;
		$this->db->query($query_string);
		return array("result" => "YES");
	}

	// File Reordering Module
	public function fileReordering($id_string) {
		for ($i = 0; $i < count($id_string); $i ++) {
			$this->db->where("id", $id_string[$i]);
			$data = array();
			$data['display_order'] = $i + 1;
			$this->db->update($this->FILE_TABLE, $data);
		}
		return array("result" => "YES");
	}

	// get file schedule function
	public function getSchedule($file_id) {
		$query_string = "SELECT * FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE id = " . $file_id . " LIMIT 1";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		$result[0]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[0]['file_name'];
		$result[0]['thumb'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[0]['name_only'] . "t.png";
		return array("result" => "YES", "data" => $result[0]);
	}

	// schedule update function
	public function scheduleUpdate($user_id, $file_id, $file_title, $dwell_time, $start_effect, $end_effect, $begin_date, $end_date) {
		$data = array();
		$data['title'] = $file_title;
		$data['stay_time'] = $dwell_time;
		$data['start_effect'] = $start_effect;
		$data['end_effect'] = $end_effect;
		$data['begin_date'] = $begin_date;
		$data['end_date'] = $end_date;
		$this->db->where("id", $file_id);
		$this->db->update($this->FILE_TABLE, $data);
		return array("result" => "YES");
	}

	//get all slides function
	public function getSlides($user_id) {
		date_default_timezone_set($this->DEFAULT_TIME_ZONE); // timezone setting        
		// now date getting
		$now_date = date("Y-m-d");
		$query_string = "SELECT * FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $user_id;
		$query_string .= " AND begin_date <= '" . $now_date . "'";
		$query_string .= " AND end_date >= '" . $now_date . "'";
//        $query_string .= " AND delete_date IS NULL";
		$query_string .= " AND (delete_date IS NULL OR DATE(delete_date) = CURRENT_DATE())";
		$query_string .= " ORDER BY display_order";
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		for ($i = 0; $i < count($result); $i ++) {
			if ($result[$i]['file_type'] === "image") { // if image
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $result[$i]['file_name'];
			} else { // if video 
				$name_arr = explode(".", $result[$i]['file_name']);
				$name_only = $name_arr[0];
				$result[$i]['url'] = "http://" . $_SERVER['SERVER_NAME'] . FILE_UPLOAD_DIRECTORY . $name_only . ".mp4";
			}
		}
		return array('result' => 'YES', 'data' => $result);
	}

	/////////////////////////////////////////////
	//Administrator Functions
	//Author :
	/////////////////////////////////////////////
	//administrator password change function
	public function adminUpdate($new_password) {
//        echo "NEW :".$new_password;
		$data = array();
		$data['user_password'] = $new_password;
		$this->db->where("user_email", "root");
		$this->db->update($this->USER_TABLE, $data);
		return array("result" => "YES");
	}

	// user delete function
	public function deleteUser($user_id) {
		// user file delete module
		$query_string = "SELECT file_name, file_type FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id = " . $user_id;
		$query = $this->db->query($query_string);
		$result = $query->result_array();
		foreach ($result as $item) {
			if ($item['file_type'] === "image") { // if image
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['file_name'];
				if (file_exists($targetFile)) {
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . "t.png";
				if (file_exists($targetFile)) {
					unlink($targetFile);
				}
			} else { // if video
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".mp4";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".webm";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".avi";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".ogg";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . ".png";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
				$targetFile = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY . $item['name_only'] . "t.png";
				if (file_exists($targetFile)) { //mp4 file delete
					unlink($targetFile);
				}
			}
		}
		// file record delete
		$query_string = "DELETE FROM " . $this->FILE_TABLE;
		$query_string .= " WHERE user_id=" . $user_id;
		$query = $this->db->query($query_string);
		// user record delete
		$query_string = "DELETE FROM " . $this->USER_TABLE;
		$query_string .=" WHERE id=" . $user_id;
		$query = $this->db->query($query_string);
		return array("result" => "YES");
	}
}
