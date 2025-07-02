def tinh_diem_trung_binh(diem_mieng, diem_15p, diem_1tiet, diem_thi):
    # Thay đổi theo hệ số nếu cần
    hs_mieng = 1
    hs_15p = 1
    hs_1tiet = 2
    hs_thi = 3

    diem_thanh_phan = [
        (diem_mieng or 0, hs_mieng),
        (diem_15p or 0, hs_15p),
        (diem_1tiet or 0, hs_1tiet),
        (diem_thi or 0, hs_thi),
    ]

    tong_diem = sum(d * hs for d, hs in diem_thanh_phan)
    tong_heso = sum(hs for _, hs in diem_thanh_phan)

    return round(tong_diem / tong_heso, 2) if tong_heso > 0 else None
