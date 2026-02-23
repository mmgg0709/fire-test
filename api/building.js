// Vercel Serverless Function
// CORS 문제 해결을 위한 프록시

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { address, apiKey } = req.query;

    if (!apiKey) {
      return res.status(400).json({ error: 'API 키가 필요합니다.' });
    }

    if (!address) {
      return res.status(400).json({ error: '주소가 필요합니다.' });
    }

    // 공공데이터포털 API 호출
    const API_URL = 'http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo';

    const params = new URLSearchParams({
      serviceKey: decodeURIComponent(apiKey),
      sigunguCd: '', // 시군구 코드 (옵션)
      bjdongCd: '',  // 법정동 코드 (옵션)
      platGbCd: '',  // 대지구분 코드 (옵션)
      bun: '',       // 번 (옵션)
      ji: '',        // 지 (옵션)
      numOfRows: '10',
      pageNo: '1',
      _type: 'json'
    });

    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error('API 호출 오류:', error);
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' });
  }
}
