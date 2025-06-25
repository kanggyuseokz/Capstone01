// 공통 API 호출 유틸리티 함수
export const callApi = async (url, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 세션 쿠키 전송을 위해 필수
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);

    // 401/403은 세션 만료로 간주하여 로그인 페이지로 리디렉션 처리
    if (!response.ok && (response.status === 401 || response.status === 403)) {
      // AuthContext 등에서 이 에러를 받아 전역적으로 로그아웃 처리 가능
      window.location.href = '/login'; 
    }
    
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    return result;
  } catch (err) {
    console.error('API call error:', err);
    // UI에 에러를 보여주기 위해 에러 객체를 반환
    return { success: false, error: err.message };
  }
};