#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Request {
    double start, end;
};

// S?p x?p theo th?i gian thuê xe ng?n nh?t
bool cmpDuration(const Request &a, const Request &b) {
    return (a.end - a.start) < (b.end - b.start);
}

// S?p x?p theo th?i gian b?t ð?u s?m nh?t
bool cmpStart(const Request &a, const Request &b) {
    return a.start < b.start;
}

// S?p x?p theo th?i gian k?t thúc s?m nh?t
bool cmpEnd(const Request &a, const Request &b) {
    return a.end < b.end;
}

void printRequests(const vector<Request> &requests, const string &title) {
    cout << "-------------------------------------------------\n";
    cout << title << "\n";
    int i = 1;
    for (const auto &req : requests) {
        cout << "ch?ng " << i++ << ": ";
        for (int j = 0; j < static_cast<int>(req.start * 4); j++) cout << " ";
        cout << fixed << setprecision(2) << req.start << "h";
        for (int j = static_cast<int>(req.start * 4); j < static_cast<int>(req.end * 4); j++) cout << "-";
        cout << fixed << setprecision(2) << req.end << "h" << endl;
    }
}

vector<Request> greedySelection(vector<Request> requests, bool (*cmp)(const Request&, const Request&)) {
    sort(requests.begin(), requests.end(), cmp);
    vector<Request> selected;
    double lastEndTime = 0;
    
    for (const auto &req : requests) {
        if (req.start >= lastEndTime) {
            selected.push_back(req);
            lastEndTime = req.end;
        }
    }
    return selected;
}

int main() {
    vector<Request> requests = {
         {1.00, 3.50}, {2.15, 5.45}, {3.50, 9.10}, {6.20, 8.40}, {5.05, 7.30}, {8.15, 11.00}
    };
    
    
    printRequests(requests, "Cac yeu cau thue xe:");
    
    vector<Request> byDuration = greedySelection(requests, cmpDuration);
    vector<Request> byStart = greedySelection(requests, cmpStart);
    vector<Request> byEnd = greedySelection(requests, cmpEnd);
    
    printRequests(byDuration, "Danh sach cac chang tham lam theo thoi gian ngan nhat");
    printRequests(byStart, "Danh sach cac chang tham lam theo thoi gian bat dau som nhat");
    printRequests(byEnd, "Danh sach cac chang tham lam theo thoi gian ket thuc som nhat");
    
    cout << "-------------------------------------------------\n";
    cout << "Ket luan: Thuat toan tham lam theo thoi gian ket thuc som nhat là toi uu nhat, voi " << byEnd.size() << " yêu c?u thuê xe ðý?c ch?n.\n";
    
    return 0;
}