#include <iostream>
#include <vector>
#include <algorithm>

struct VatPham {
    int id;
    double trong_luong;
    double gia_tri;
    double ti_le;
};

int main() {
    // Du lieu dau vao
    std::vector<VatPham> danh_sach = {
        
         {1, 3, 7, 0},
        {2, 4, 8, 0},  // Vat pham 1
        {3, 7, 14, 0}, // Vat pham 2
         // Vat pham 3
        {4, 5, 9, 0},  // Vat pham 4
        {5, 9, 9, 0}   // Vat pham 5
    };
    double suc_chua = 15.0;

    // In danh sach vat pham ban dau
    std::cout << "Danh sach vat pham:\n";
    for (const auto &vat_pham : danh_sach) {
        std::cout << "Vat pham " << vat_pham.id << ": Trong luong = " << vat_pham.trong_luong
                  << ", Gia tri = " << vat_pham.gia_tri << "\n";
    }
    std::cout << "\n";

    // Chien luoc 1: Chon theo ti le gia tri/trong luong
    std::vector<VatPham> danh_sach_ti_le = danh_sach;
    double tong_trong_luong_ti_le = 0, tong_gia_tri_ti_le = 0;
    std::vector<bool> da_chon_ti_le(danh_sach.size(), false);

    for (auto &vat_pham : danh_sach_ti_le) {
        vat_pham.ti_le = vat_pham.gia_tri / vat_pham.trong_luong;
    }

    std::sort(danh_sach_ti_le.begin(), danh_sach_ti_le.end(), [](const VatPham &a, const VatPham &b) {
        return a.ti_le > b.ti_le;
    });

    std::cout << "Chien luoc 1: Chon theo ti le gia tri/trong luong:\n";
    for (int i = 0; i < danh_sach_ti_le.size(); i++) {
        if (tong_trong_luong_ti_le + danh_sach_ti_le[i].trong_luong <= suc_chua) {
            tong_trong_luong_ti_le += danh_sach_ti_le[i].trong_luong;
            tong_gia_tri_ti_le += danh_sach_ti_le[i].gia_tri;
            da_chon_ti_le[danh_sach_ti_le[i].id - 1] = true;
            std::cout << "  Chon vat pham " << danh_sach_ti_le[i].id << ": Trong luong = "
                      << danh_sach_ti_le[i].trong_luong << ", Gia tri = " << danh_sach_ti_le[i].gia_tri << "\n";
        }
    }
    std::cout << "  Tong trong luong: " << tong_trong_luong_ti_le << "\n";
    std::cout << "  Tong gia tri: " << tong_gia_tri_ti_le << "\n\n";

    // Chien luoc 2: Chon theo gia tri lon hon
    std::vector<VatPham> danh_sach_gia_tri = danh_sach;
    double tong_trong_luong_gia_tri = 0, tong_gia_tri_gia_tri = 0;
    std::vector<bool> da_chon_gia_tri(danh_sach.size(), false);

    std::sort(danh_sach_gia_tri.begin(), danh_sach_gia_tri.end(), [](const VatPham &a, const VatPham &b) {
        return a.gia_tri > b.gia_tri;
    });

    std::cout << "Chien luoc 2: Chon theo gia tri lon hon:\n";
    for (int i = 0; i < danh_sach_gia_tri.size(); i++) {
        if (tong_trong_luong_gia_tri + danh_sach_gia_tri[i].trong_luong <= suc_chua) {
            tong_trong_luong_gia_tri += danh_sach_gia_tri[i].trong_luong;
            tong_gia_tri_gia_tri += danh_sach_gia_tri[i].gia_tri;
            da_chon_gia_tri[danh_sach_gia_tri[i].id - 1] = true;
            std::cout << "  Chon vat pham " << danh_sach_gia_tri[i].id << ": Trong luong = "
                      << danh_sach_gia_tri[i].trong_luong << ", Gia tri = " << danh_sach_gia_tri[i].gia_tri << "\n";
        }
    }
    std::cout << "  Tong trong luong: " << tong_trong_luong_gia_tri << "\n";
    std::cout << "  Tong gia tri: " << tong_gia_tri_gia_tri << "\n\n";

    // Chien luoc 3: Chon theo trong luong nho hon
    std::vector<VatPham> danh_sach_trong_luong = danh_sach;
    double tong_trong_luong_trong_luong = 0, tong_gia_tri_trong_luong = 0;
    std::vector<bool> da_chon_trong_luong(danh_sach.size(), false);

    std::sort(danh_sach_trong_luong.begin(), danh_sach_trong_luong.end(), [](const VatPham &a, const VatPham &b) {
        return a.trong_luong < b.trong_luong;
    });

    std::cout << "Chien luoc 3: Chon theo trong luong nho hon:\n";
    for (int i = 0; i < danh_sach_trong_luong.size(); i++) {
        if (tong_trong_luong_trong_luong + danh_sach_trong_luong[i].trong_luong <= suc_chua) {
            tong_trong_luong_trong_luong += danh_sach_trong_luong[i].trong_luong;
            tong_gia_tri_trong_luong += danh_sach_trong_luong[i].gia_tri;
            da_chon_trong_luong[danh_sach_trong_luong[i].id - 1] = true;
            std::cout << "  Chon vat pham " << danh_sach_trong_luong[i].id << ": Trong luong = "
                      << danh_sach_trong_luong[i].trong_luong << ", Gia tri = " << danh_sach_trong_luong[i].gia_tri << "\n";
        }
    }
    std::cout << "  Tong trong luong: " << tong_trong_luong_trong_luong << "\n";
    std::cout << "  Tong gia tri: " << tong_gia_tri_trong_luong << "\n\n";

    // Tim chien luoc cho gia tri lon nhat
    double gia_tri_max = std::max({tong_gia_tri_ti_le, tong_gia_tri_gia_tri, tong_gia_tri_trong_luong});
    std::vector<bool> da_chon_max;
    if (gia_tri_max == tong_gia_tri_ti_le) {
        da_chon_max = da_chon_ti_le;
    } else if (gia_tri_max == tong_gia_tri_gia_tri) {
        da_chon_max = da_chon_gia_tri;
    } else {
        da_chon_max = da_chon_trong_luong;
    }

    // Ve bieu do (theo chien luoc co gia tri lon nhat)
    std::cout << "\nBieu do (Trong luong [kg] vs Gia tri [$]):\n";
    int max_trong_luong = 10, max_gia_tri = 15;
    char bieu_do[11][16];

    for (int i = 0; i <= max_trong_luong; i++) {
        for (int j = 0; j <= max_gia_tri; j++) {
            bieu_do[i][j] = ' ';
        }
    }

    for (int i = 0; i <= max_trong_luong; i++) bieu_do[i][0] = '.';
    for (int j = 0; j <= max_gia_tri; j++) bieu_do[max_trong_luong][j] = '.';

    for (int i = 0; i < danh_sach.size(); i++) {
        int w = static_cast<int>(danh_sach[i].trong_luong);
        int v = static_cast<int>(danh_sach[i].gia_tri);
        if (w <= max_trong_luong && v <= max_gia_tri) {
            bieu_do[max_trong_luong - w][v] = da_chon_max[danh_sach[i].id - 1] ? '+' : '*';
            for (int j = 0; j < v; j++) {
                if (bieu_do[max_trong_luong - w][j] == ' ') bieu_do[max_trong_luong - w][j] = '.';
            }
            for (int k = 0; k < w; k++) {
                if (bieu_do[max_trong_luong - k][v] == ' ') bieu_do[max_trong_luong - k][v] = '.';
            }
        }
    }

    for (int i = 0; i <= max_trong_luong; i++) {
        if (max_trong_luong - i < 10) std::cout << " ";
        std::cout << (max_trong_luong - i) << " ";
        for (int j = 0; j <= max_gia_tri; j++) {
            std::cout << bieu_do[i][j] << "  ";
        }
        for (int k = 0; k < danh_sach.size(); k++) {
            int w = static_cast<int>(danh_sach[k].trong_luong);
            if (max_trong_luong - i == w) {
                std::cout << " Vat pham " << (k + 1);
            }
        }
        std::cout << "\n";
    }
    std::cout << "   ";
    for (int j = 0; j <= max_gia_tri; j++) {
        std::cout << j << " ";
        if (j < 10) std::cout << " ";
    }
    std::cout << "\n";
    std::cout << "  ";
    for (int j = 0; j <= max_gia_tri; j++) {
        if (j == 0) std::cout << "   ";
        else if (j == max_gia_tri) std::cout << "$";
        else std::cout << "";
    }
    std::cout << "\n";

    return 0;
}