<?php

if (!defined('BASEPATH'))
	exit('No direct script access allowed');
header("Access-Control-Allow-Origin: *");
class Service extends CI_Controller {
	public function index() {
	}
    public function registerUser() {
		$this->load->model('user_model');
		$this->load->helper('string'); // Random Code Library

		$postResult = $this->input->post();
		$userEmail = $postResult['userEmail'];
		$userPwd = $postResult['userPwd'];
		$userCode = random_string('numeric', 12); //12 digit Generate
		$ret_value = $this->user_model->createAuthUser("N", "N", "N", "N", "N", "N", "N", "N", $userEmail, $userPwd, "N", "N", $userCode);
		$this->sendVerificationEmail($userCode, $userEmail);
		echo json_encode($ret_value);
		exit;
	}
	//////// Profile Page Update //////////////
	public function update() {
		$this->load->model('service_model');
		$postResult = $this->input->post();
		$user_id = $postResult['user_id'];
		$first_name = $postResult['first_name'];
		$last_name = $postResult['last_name'];
		$user_email = $postResult['user_email'];
		$new_password = $postResult['new_password'];
		$ret_value = $this->service_model->updateAuthUser($user_id, $first_name, $last_name, $user_email, $new_password);
		echo json_encode($ret_value);
		exit;
	}
	//////// Administrator Save Data //////////////
	public function save_user() {
		$this->load->model('service_model');
		$postResult = $this->input->post();
		$user_id = $postResult['id'];
		$first_name = $postResult['f'];
		$last_name = $postResult['l'];
		$user_email = $postResult['e'];
		$new_password = $postResult['p'];
		$ret_value = $this->service_model->updateAuthUser($user_id, $first_name, $last_name, $user_email, $new_password);
		echo json_encode($ret_value);
		exit;
	}
	public function login() {
		$this->load->model('service_model');
		$postResult = $this->input->post();
		$user_email = $postResult['user_email'];
		$user_password = $postResult['user_password'];
		$ret_value = $this->service_model->loginUser($user_email, $user_password);
		echo json_encode($ret_value);
		exit;
	}
	public function get_users() {
		$this->load->model('service_model');
		$ret_value = $this->service_model->getUsers();
		echo json_encode($ret_value);
		exit;
	}
	public function test() {
		echo "connect success";
		exit;
	}
	private function my_file_upload() {
		ini_set('max_execution_time', 1000);
		ini_set('max_input_time', 1000);
		ini_set('memory_limit', -1);
		ini_set('post_max_size', "512M");
		$this->load->model('service_model');
		$this->load->helper('string'); // Random Code Library
		$pieces = explode("/", $_FILES['file']['type']); //userid explode
		$file_type = $pieces[0]; // get file type
		$pieces = explode("=", $_SERVER['REQUEST_URI']); //userid explode
		$request_userid = $pieces[1]; // get user id
		$pieces = explode(".", $_FILES['file']['name']); //userid explode
		$len = count($pieces);
		$file_extend = $pieces[$len - 1]; // get file extend
		$file_name = random_string('numeric', 80); //30 digit Generate
		$file_name = $request_userid . "-" . $file_name; //generate file name
		$file_full_name = $file_name . "." . $file_extend; //generate file name
		$file_origin_name = $_FILES['file']['name'];
		if (!empty($_FILES)) { // important file transmit
			$tempFile = $_FILES['file']['tmp_name'];		  //3             
			$targetPath = $_SERVER['DOCUMENT_ROOT'] . FILE_UPLOAD_DIRECTORY;
			$targetFile = $targetPath . $file_full_name;  //5
			move_uploaded_file($tempFile, $targetFile); //6
			$convert_result = $this->my_file_conversion($targetFile, $file_name, $targetPath, $file_type);
		}
		if ($convert_result['result'] === "YES") {
			$play_time = $convert_result['total_time'];
			if ($file_type == 'video') {
				$file_full_name = $file_name.'.mp4';
			}
			$ret_value = $this->service_model->fileUpload($request_userid, $file_full_name, $file_origin_name, $file_type, $file_name, $play_time);
			return true;
		} else {
			return false;
		}
	}

	public function my_file_conversion($targetFile, $file_name, $targetPath, $file_type) {
		set_time_limit(1000);
		if ($file_type === "video") { // video
			$cmd = 'ffmpeg -i ' . $targetFile . ' -vcodec h264 -acodec aac -strict -2 ' . $targetPath . $file_name . '.mp4 2>&1';
			echo exec($cmd, $output);
			$cmd = 'ffmpeg -i ' . $targetFile . ' -ss 00:00:01 -vframes 1 -vf scale=200:150 ' . $targetPath . $file_name . 't.png 2>&1';
			echo exec($cmd);
			// file length getting
			$re = "/Duration\s*:\s*(?P<h>\d+):(?P<m>\d+):(?P<s>\d+)\.(?P<ms>\d+)/";
			if (preg_match($re, $output[17], $matches)) {
				$hours = $matches['h'];
				$minutes = $matches['m'];
				$seconds = $matches['s'];
				$total = $hours * 3600 + $minutes * 60 + $seconds + 1;
			}
			return array("result" => "YES", "total_time" => $total);
		} else { // image
			$cmd = 'ffmpeg -i ' . $targetFile . ' -vf scale=200:150 ' . $targetPath . $file_name . 't.png 2>&1'; // thumbnails making
			echo exec($cmd);
			return array("result" => "YES");
		}
	}

	// File Upload Request Method
	public function upload() {
		// File type detect
		$pieces = explode("/", $_FILES['file']['type']); //userid explode
		if ($pieces[0] === "image" || $pieces[0] === "video") {
			$file_process = $this->my_file_upload();
			if ($file_process)
				exit;
		}
	}
	// get user all files getting function
	public function get_files() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$user_id = $postRequest['user_id'];
		$ret_value = $this->service_model->getFiles($user_id);
		echo json_encode($ret_value);
		exit;
	}
	
	// get user all files getting function
	public function get_slidefiles() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$user_id = $postRequest['user_id'];
		$ret_value = $this->service_model->getSlideFiles($user_id);
//		var_dump($ret_value);
//		exit;
		echo json_encode($ret_value);
		exit;
	}

	// schedule getting function
	public function get_schedule() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$file_id = $postRequest['file_id'];
		$ret_value = $this->service_model->getSchedule($file_id);
		echo json_encode($ret_value);
		exit;
	}

	// File Schedule update Function   
	public function schedule_update() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$user_id = $postRequest['user_id'];
		$file_id = $postRequest['file_id'];
		$file_title = $postRequest['file_title'];
		$dwell_time = $postRequest['dwell_time'];
		$start_effect = $postRequest['start_effect'];
		$end_effect = $postRequest['end_effect'];
		$active_time = $postRequest['active_time'];
		$buffer = explode("-", $active_time);
		$begin_date = date("Y-m-d", strtotime($buffer[0]));
		$end_date = date("Y-m-d", strtotime($buffer[1]));
		$ret_value = $this->service_model->scheduleUpdate($user_id, $file_id, $file_title, $dwell_time, $start_effect, $end_effect, $begin_date, $end_date);
		echo json_encode($ret_value);
		exit;
	}

	public function delete_file() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$id = $postRequest['id'];
		$file_name = $postRequest['file_name'];
		$ret_value = $this->service_model->deleteFile($id, $file_name);
		echo json_encode($ret_value);
		exit;
	}

	// Drag and Drop Reordering Method
	public function reordering() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$id_string = $postRequest['ids'];
		$ret_value = $this->service_model->fileReordering($id_string);
		echo $ret_value['result'];
		exit;
	}

	// get slides function
	// get user all files getting function
	public function get_slides() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$user_id = $postRequest['user_id'];
		$ret_value = $this->service_model->getSlides($user_id);
		echo json_encode($ret_value);
		exit;
	}

	////////////////////////////////////////////
	//  Administrator Functions
	//  Author : 
	////////////////////////////////////////////
	public function admin_update() {
		$postRequest = $this->input->post();
		$this->load->model('service_model');
		$new_password = $postRequest['new_password'];
		$ret_value = $this->service_model->adminUpdate($new_password);
		echo json_encode($ret_value);
		exit;
	}

	public function delete_user() {
		$postRequest = $this->input->post();
		$this->load->model("service_model");
		$user_id = $postRequest['user_id'];
		$ret_value = $this->service_model->deleteUser($user_id);
		echo json_encode($ret_value);
		exit;
	}

}

/* End of file service.php */
/* Location: ./application/controllers/service.php */
